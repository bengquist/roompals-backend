import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class Chore extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => String)
  @Column()
  title: string;

  @Field(() => String)
  @Column()
  owner: string;

  @Field(() => String)
  @Column()
  emoji: string;

  @Field(() => String)
  @Column()
  cycleDate: string;

  @Field(() => Boolean)
  @Column({ default: false })
  isCompleted: false;
}
