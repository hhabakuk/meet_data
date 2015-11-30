require 'uri'

class Group < ActiveRecord::Base
  belongs_to :category
  belongs_to :city

  BASE_URL= "http://api.meetup.com"
  API_KEY = ENV['MEETUP_KEY']

  # generate seed data for groups
  def self.init_groups

    @categories = Category.all
    @cities = City.all

    # for each city, find groups for each category and add entries to the database
    @cities.each do |city|
      @categories.each do |category|
        count = 0
        offset = 0
        length = 200

        # keep calling more data from the API until none left (max. of 200 results returned per call)
        while length == 200
          response = HTTParty.get(URI.escape("#{ BASE_URL }/find/groups?location=#{city.name.gsub(" ", "+")}&country=#{city.country}&category=#{category.meetup_id}&page=200&offset=#{offset}&only=name,members,category&key=#{ API_KEY }"))
          length = response.length
          count += length
          offset += 1
        end

        # count represents total number of groups in a category for the city
        count

        # create new database entry
        Group.create(city_name: city.name, country: city.country, city_id: city.id, category_name: category.name, category_id: category.id, group_count: count)

        puts city.name.gsub(" ", "+")
        puts city.country
        puts category.meetup_id
        puts category.name
        puts count
      end
    end

  end

end
