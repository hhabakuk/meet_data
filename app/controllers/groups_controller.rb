class GroupsController < ApplicationController

  def index
    @groups = Group.all
    render json: @groups
  end

end
