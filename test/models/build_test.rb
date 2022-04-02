# frozen_string_literal: true

require "test_helper"

class BuildTest < ActiveSupport::TestCase
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
          content: "print(\"hello\")\nexit(\"bye\")"
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
          content: build_folder.scripts.first.content
        }
      }.to_json.gsub("\\n", "\\...n")
    end

    test "#export_string should return valid export_string" do
      assert_equal @build.export_string, @build_export_table
    end

    test "#parse_string should return a valid build object" do
      string = @build_export_table
      string = string[0..20] << "\n" + string[20..-1]
      assert_equal Build.parse_string(string).export_string, @build.export_string
    end
  end
end
