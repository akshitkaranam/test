import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { MinLength, MaxLength, Min, Max, IsInt } from 'class-validator';
import { Restaurant } from './Restaurant';
import { AppUser } from './AppUser';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsInt()
  @Min(0, {
    message: 'Rating should not be less than 0!',
  })
  @Max(5, {
    message: 'Rating should not be more than 5!',
  })
  rating: number;

  @Column()
  @MinLength(50, {
    message: 'Review text has to have atleast 50 characters!',
  })
  @MaxLength(500, {
    message: 'Review text should not exceed 500 characters!',
  })
  text: string;

  @Column('decimal')
  totalPrice: number;

  @Column()
  @IsInt()
  @Min(1, {
    message: 'Number of Pax should not be less than 1!',
  })
  pax: number;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  lastUpdatedOn: Date;

  @OneToMany(() => AppUser, (user: AppUser) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  public user: AppUser;

  @OneToMany(() => Restaurant, (restaurant: Restaurant) => restaurant.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public restaurant: Restaurant;
}
