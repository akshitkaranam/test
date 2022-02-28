import { Entity, PrimaryGeneratedColumn, BaseEntity, ManyToMany, JoinTable } from 'typeorm';

import { Restaurant } from './Restaurant';
import { PersonalList } from './PersonalList';

@Entity()
export class ListRestaurant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => PersonalList, (personalList) => personalList.listRestaurants, {
    onDelete: 'CASCADE',
    eager: true,
    cascade: true, 
  })
  @JoinTable()
  personalList: PersonalList[];
  
  @ManyToMany(() => Restaurant, (restaurant) => restaurant.listRestaurants, {
    onDelete: 'CASCADE',
    eager:true,
    cascade: true,
  })
  @JoinTable()
  restaurants: Restaurant[];
  

  addPersonalList(personalList: PersonalList) {
    if (this.personalList == null) {
      this.personalList = new Array<PersonalList>();
    }
    this.personalList.push(personalList);
    // console.log(this.personalList)
  }

  addRestaurant(restaurant: Restaurant) {
    if (this.restaurants == null) {
      this.restaurants = new Array<Restaurant>();
    }
    this.restaurants.push(restaurant);
    // console.log(this.restaurants)
  }

  // @ManyToMany(() => PersonalList, (list) => list.id, { onDelete: 'CASCADE',cascade: ["update"] })
  // @JoinTable()
  // personalList: PersonalList[];

  // @OneToMany(() => Restaurant, restaurant => restaurant.id, { onDelete: 'CASCADE' })
  // restaurantID: Restaurant;
}
