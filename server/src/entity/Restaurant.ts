import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
// import { ListRestaurant } from './ListRestaurant';
import { PersonalList } from './PersonalList';
import { Review } from './Review';

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => PersonalList, (personalList) => personalList.restaurants)
  list: PersonalList[];

  @ManyToOne(() => Review, (review) => review.id,)
  @JoinTable()
  public reviews: Review[];

  addReviewToRestaurant(restaurant: Review) {
    if (this.reviews == null) {
      this.reviews = new Array<Review>();
    }
    this.reviews.push(restaurant);
  }
}
