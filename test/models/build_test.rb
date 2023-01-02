# frozen_string_literal: true

# == Schema Information
#
# Table name: builds
#
#  id         :bigint           not null, primary key
#  message    :string
#  name       :string
#  published  :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_id    :bigint           not null
#
# Indexes
#
#  index_builds_on_post_id  (post_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#
require "test_helper"

class BuildTest < ActiveSupport::TestCase
  setup do
    @build = build :build, published: true
  end

  test "#clone should return a new build object same attributes and same files" do
    @build.folders = []
    nested_folder = build :folder, foldable: @build
    nested_folder.scripts = []
    nested_folder.scripts << build(:script, scriptable: nested_folder)
    @build.published = true
    @build.save

    clone = @build.clone
    assert_equal clone.attributes, @build.attributes
  end

  # files validation

  test "valid with a script in a folder" do
    folder_with_script = build(:folder, foldable: nil)
    folder_with_script.scripts = [build(:script, scriptable: nil)]
    @build.scripts = []
    @build.folders = [folder_with_script]
    @build.valid?
    assert_empty @build.errors[:files]
  end

  test "should be saved valid even without files when it is not published" do
    @build.published = false
    @build.scripts = []
    @build.folders = []

    @build.valid?
    assert_empty @build.errors[:files]
  end

  test "valid with a valid script" do
    @build.scripts = [build(:script, scriptable: nil)]
    @build.valid?
    assert_empty @build.errors[:files]
  end

  test "invalid without a script" do
    folder_without_script = build(:folder, foldable: nil, scripts: [])
    @build.scripts = []
    @build.folders = [folder_without_script]
    @build.valid?
    refute_empty @build.errors[:files]
  end

  class Parser < ActiveSupport::TestCase
    setup do
      @build = build :build
      @build.folders << build(:folder)
      @build.scripts.first.content = "print(\"hello\")\nexit(\"bye\")"
      build_folder = @build.folders.first
      @build_export_table = {
        "0": {
          parent: "",
          type: "folder",
          name: @build.name
        },
        "1": {
          parent: "0",
          type: "script",
          name: @build.scripts.first.name,
          content: GreyParser::Compressor.compress("print(\"hello\")\nexit(\"bye\")")
        },
        "2": {
          parent: "0",
          type: "folder",
          name: build_folder.name
        },
        "3": {
          parent: "2",
          type: "script",
          name: build_folder.scripts.first.name,
          content: GreyParser::Compressor.compress(build_folder.scripts.first.content)
        }
      }.to_json
    end

    test "#export_string should return valid export_string" do
      assert_equal @build.export_string, @build_export_table
    end

    test "#parse_string should return a valid build object" do
      string = @build_export_table
      string = string[0..20] << "\n" + string[20..-1]
      assert_equal Build.parse_string(string).export_string, @build.export_string
    end

    # todo: add tests to check the compressor here
  end
end
