import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chore } from "./Chore";
import { UserGroup } from "./UserGroup";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  username: string;

  @Field(() => String)
  @Column()
  email: string;

  @Field(() => String)
  @Column()
  password: string;

  @Field(() => [Chore])
  @OneToMany(() => Chore, (chore) => chore.user)
  chores: Chore[];

  @Field(() => UserGroup)
  @ManyToOne(() => UserGroup, (group) => group.users)
  group: UserGroup;
}
