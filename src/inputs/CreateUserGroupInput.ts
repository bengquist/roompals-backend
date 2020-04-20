import { Field, InputType } from "type-graphql";

@InputType()
export class CreateUserGroupInput {
  @Field()
  name: string;

  @Field()
  adminId: string;
}
