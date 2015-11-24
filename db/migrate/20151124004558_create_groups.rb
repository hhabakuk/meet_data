class CreateGroups < ActiveRecord::Migration
  def change
    create_table :groups do |t|
      t.text :city_name
      t.text :country
      t.integer :city_id
      t.text :category_name
      t.integer :category_id
      t.integer :group_count

      t.timestamps null: false
    end
  end
end
