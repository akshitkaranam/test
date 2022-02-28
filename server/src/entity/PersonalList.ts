import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { MinLength, MaxLength } from 'class-validator';
import { AppUser } from './AppUser';
// import { ListRestaurant } from './ListRestaurant';
import { Restaurant } from './Restaurant';

@Entity()
export class PersonalList extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @MinLength(1, {
    message: 'List Name has to be between 1 and 100 characters',
  })
  @MaxLength(100, {
    message: 'List Name has to be between 1 and 100 characters',
  })
  @Column()
  listName: string;

  @ManyToOne(() => AppUser, (user: AppUser) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  userID: AppUser;

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.list, {
    onDelete: 'CASCADE',
    eager: true,
    cascade: true,
  })
  @JoinTable()
  restaurants: Restaurant[];

  addRestaurant(restaurant: Restaurant) {
    if (this.restaurants == null) {
      this.restaurants = new Array<Restaurant>();
    }
    this.restaurants.push(restaurant);
    // console.log(this.restaurants)
  }

  removeRestaurant(restaurantID: string) {
    if (this.restaurants !== null) {
      this.restaurants = this.arrayRemove(this.restaurants,restaurantID)
    }
    console.log(this.restaurants)
  }

   arrayRemove(arr:Array<any>, value:string) { 
    
    return arr.filter(function(ele){ 
        return ele.id != value; 
    });
}
}
