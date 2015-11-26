class City < ActiveRecord::Base
  has_many :groups

  BASE_URL= "http://api.meetup.com"
  API_KEY = "key=682973467622505a78213a1670961"

  def self.init_cities
    citiesFirst = HTTParty.get("#{ BASE_URL }/2/cities.json/?&page=200&radius=9999999999&#{ API_KEY }")

    citiesFirst.first[1].each do |city|
      City.create(name: "#{city['city']}", country: "#{city['country']}", member_count: city['member_count'], lon: city['lon'], lat: city['lat'])
    end

    citiesSecond = HTTParty.get("#{ BASE_URL }/2/cities.json/?&page=200&offset=1&radius=9999999999&#{ API_KEY }")

    citiesSecond.first[1].each do |city|
      City.create(name: "#{city['city']}", country: "#{city['country']}", member_count: city['member_count'], lon: city['lon'], lat: city['lat'])
    end
  end

end
