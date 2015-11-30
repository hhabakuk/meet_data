class City < ActiveRecord::Base
  has_many :groups

  BASE_URL= "http://api.meetup.com"
  API_KEY = ENV['MEETUP_KEY']

  # generate seed data for cities
  def self.init_cities
    citiesFirst = HTTParty.get("#{ BASE_URL }/2/cities.json/?&page=200&radius=9999999999&key=#{ API_KEY }")

    # call API for data (first 200 results and data returned is sorted by highest member_count)
    citiesFirst.first[1].each do |city|
      City.create(name: "#{city['city']}", country: "#{city['country']}", member_count: city['member_count'], lon: city['lon'], lat: city['lat'])
    end

    # call API for more data (another 200 results and data returned is sorted by highest member_count)
    citiesSecond = HTTParty.get("#{ BASE_URL }/2/cities.json/?&page=200&offset=1&radius=9999999999&key=#{ API_KEY }")

    citiesSecond.first[1].each do |city|
      City.create(name: "#{city['city']}", country: "#{city['country']}", member_count: city['member_count'], lon: city['lon'], lat: city['lat'])
    end
  end

end
