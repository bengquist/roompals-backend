import { Field, InputType } from "type-graphql";

@InputType()
export class CreateChoreInput {
  @Field()
  title: string;

  @Field()
  owner: string;

  @Field()
  emoji: string;

  @Field()
  cycleDate: string;
}
