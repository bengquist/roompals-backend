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
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column("text", { unique: true })
  username: string;

  @Field(() => String)
  @Column("text", { unique: true })
  email: string;

  @Column("text")
  password: string;

  @Column("int", { default: 0 })
  tokenVersion: number;

  @Column("bool", { default: true })
  newUser: number;

  @Field(() => [Chore])
  @OneToMany(() => Chore, (chore) => chore.owner)
  chores: Chore[];

  @Field(() => UserGroup)
  @ManyToOne(() => UserGroup, (group) => group.users)
  group: UserGroup;
}
