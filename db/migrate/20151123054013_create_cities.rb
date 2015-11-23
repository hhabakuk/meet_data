class CreateCities < ActiveRecord::Migration
  def change
    create_table :cities do |t|
      t.string :name
      t.string :country
      t.integer :member_count

      t.timestamps null: false
    end
  end
end
