class CreateCities < ActiveRecord::Migration
  def change
    create_table :cities do |t|
      t.text :name
      t.text :country
      t.integer :member_count
      t.decimal :lon
      t.decimal :lat

      t.timestamps null: false
    end
  end
end
