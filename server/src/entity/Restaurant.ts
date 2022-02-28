import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToMany } from 'typeorm';
// import { ListRestaurant } from './ListRestaurant';
import { PersonalList } from './PersonalList';

@Entity()
export class Restaurant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => PersonalList,   personalList => personalList.restaurants)
    list: PersonalList[]
}
