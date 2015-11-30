# Where To Now

## Overview

Where To Now allows users to understand and visualise the culture of cities around the world. The data gathered from the Meetup API has been used to determine the relative importance of each of the 33 categories, based on the number of groups in each city. This provides users with meaningful information regarding the cities they are most likely to find people with a common interest.

## Technologies used

1. Ruby on Rails
2. JavaScript, including the following libraries:
  - [Chart.js](http://www.chartjs.org/)
  - [D3.js](http://d3js.org/)
  - jQuery
  - Ajax
  - Underscore
3. Meetup API
4. PostgreSQL
5. HTML5
6. CSS3
7. Heroku hosting

## Key features

- Bar chart - top 10 cities for which there are groups relevant to the category selected by a user
- Doughnut chart – all groups in the city selected
- Radar chart – compare city culture information with another city
- Users can select a city on the map and be directed to the relevant city's Meetup.com page

## Features to be added

- Make cities on the map clickable to display city culture information to the user

## Links

Check out the site - [https://wheretonow.herokuapp.com/](https://wheretonow.herokuapp.com/)

## Approach / design notes

##### Wireframe:

![Image of Wireframe](https://files.slack.com/files-pri/T0351JZQ0-F0FBLJN8K/pasted_image_at_2015_11_27_01_06_am.png?pub_secret=367ac51341)

##### Database tables:

![Image of Database tables](https://files.slack.com/files-pri/T0351JZQ0-F0FBP0RHU/where_to.png?pub_secret=09a6c11088)

##### Presentation:

Link to presentation slides - [https://drive.google.com/file/d/0B9k7U6zZJvC7a1Q5NlFFME9nUHM/view?usp=sharing](https://drive.google.com/file/d/0B9k7U6zZJvC7a1Q5NlFFME9nUHM/view?usp=sharing)

## Installation

##### Option 1 - use existing seed data (last updated 26 November 2015)

1. Fork this repository
2. Create a local clone
3. Run the code below in your Terminal to set up your database

  ```
  $ rake db:create
  $ rake db:migrate
  $ rake db:seed
  ```

##### Option 2 - get updated data using the Meetup API

1. Fork this repository
2. Create a local clone
3. Run the code below in your Terminal to set up your database

  ```
  $ rake db:create
  $ rake db:migrate
  ```

4. Get an API key [here](https://secure.meetup.com/meetup_api/key/)
5. Create a new file called `.env` in the root folder
6. Add the code below to your new .env file

  ```ruby
  MEETUP_KEY=YOURAPIKEYFROMMEETUP
  ```

7. Add the code below to your Gemfile

  ```ruby
  gem 'dotenv-rails', :groups => [:development, :test]
  ```

8. Bundle the Gemfile in your terminal - `bundle`
9. Replace the code in the db/seeds.rb file with the code below

  ```ruby
  Category.init_categories
  City.init_cities
  Groups.init_groups
  ```

10. Run the code below in your Terminal to seed data into your database (note: this may take up to 45 minutes depending on your connection / the Meetup API)

  ```
  $ rake db:seed
  ```

## Acknowledgements

##### Team members

- [Helen](https://github.com/hhabakuk)
- [Bono](https://github.com/bonogit)
- [Aviel](https://github.com/avielgoh)

Thanks to [DT](https://github.com/epoch), [Matt](https://github.com/mattswann) and the WDI4 appleandriods class for all your assistance and guidance!

*This project was undertaken as part of the General Assembly WDI course I undertook in 2015.*
