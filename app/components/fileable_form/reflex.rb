# frozen_string_literal: true

class FileableForm::Reflex < ApplicationReflex
  before_reflex :set_fileable, only: [:add_script, :add_folder]

  def update_build_name
    build = Build.find_signed(element.dataset[:build_id])
    build.name = element.value
    if build.valid?
      build.save
      cable_ready.text_content selector: "#build-name-error", text: ""
    else
      cable_ready.text_content selector: "#build-name-error", text: build.errors[:name].to_sentence
    end

    morph :nothing
  end

  def import_build(params)
    string = params["string"]
    name = params["name"]
    build_id = params["build_id"]

    string = string.delete("\n")
    string = string.gsub("\\...n", "\\n")

    begin
      build = Build.find_signed(build_id)
      new_build = Build.parse_string(string, name)
      build.scripts = new_build.scripts
      build.folders = new_build.folders
      build.save
      cable_ready.text_content selector: "#import-error", text: ""
    rescue => err
      cable_ready.text_content selector: "#import-error", text: err
      morph :nothing
    end
  end

  def add_build
    post = Post.find_signed(element.dataset[:post_id])
    post.builds << Build.new(name: "draft build", published: false)
    post.save
  end

  def add_script
    Script.create(name: "draft_script.src", content: "draft content", scriptable: @fileable)
  end

  def destroy_script
    Script.find_signed(element.dataset[:script_id]).destroy
  end

  def add_folder
    Folder.create(name: "draft_folder", foldable: @fileable)
  end

  def destroy_folder
    Folder.find_signed(element.dataset[:folder_id]).destroy
  end

  def set_fileable
    @fileable_type = element.dataset[:fileable_type]
    @fileable_id = element.dataset[:fileable_id]
    @fileable = @fileable_type.constantize.find_signed(@fileable_id)
  end
end
