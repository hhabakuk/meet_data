class City < ActiveRecord::Base
  has_many :groups

  BASE_URL= "http://api.meetup.com"
  API_KEY = "key=682973467622505a78213a1670961"

  def self.init_cities
    cities = HTTParty.get("#{ BASE_URL }/2/cities.json/?&page=200&radius=9999999999&only=city,country,member_count&#{ API_KEY }")

    cities.first[1].each do |city|
      City.create(name: "#{city['city']}", country: "#{city['country']}", member_count: city['member_count'])
    end
  end

end
