class CreateGroups < ActiveRecord::Migration
  def change
    create_table :groups do |t|
      t.integer :category_id
      t.integer :city_id

      t.timestamps null: false
    end
  end
end
