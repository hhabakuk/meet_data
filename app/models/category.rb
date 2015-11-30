class Category < ActiveRecord::Base
  has_many :groups

  BASE_URL= "http://api.meetup.com"
  API_KEY = ENV['MEETUP_KEY']

  # generate seed data for categories
  def self.init_categories
    categories = HTTParty.get("#{ BASE_URL }/2/categories.json/?key=#{ API_KEY }")

    categories.first[1].each do |category|
      Category.create(name: "#{category['name']}", meetup_id: category['id'])
    end
  end

end
