import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany } from 'typeorm';
import { ListRestaurant } from './ListRestaurant';

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => ListRestaurant,   listRestaurnat => listRestaurnat.restaurants)
    listRestaurants: ListRestaurant[]
}
