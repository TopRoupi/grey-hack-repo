# frozen_string_literal: true

class Posts::BuildsCard::Component < ApplicationComponent
  def initialize(post:, edit: false)
    @post = post
    @edit = edit
  end

  def before_render
    @selected_index = session[:selected_build]
    @selected_build = @post.builds[@selected_index] if @selected_index

    return if @selected_build.nil? || @edit

    @export_string = @selected_build.children_index_table do |obj, parent|
      output = {}
      output["parent"] = parent.to_s
      output["type"] = obj.instance_of?(Script) ? "script" : "folder"
      output["name"] = obj.name
      output["content"] = obj.content if obj.respond_to? :content

      output.map do |key, value|
        [key, value.gsub("\"", "\"\"")]
      end.to_h
    end.to_json.gsub("\\\"", "\"")
  end
end
