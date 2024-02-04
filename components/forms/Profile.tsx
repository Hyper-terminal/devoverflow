"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { updateProfile } from "@/lib/actions/user.action";
import { ProfileSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type ProfileProps = {
  mongoUser: any;
};

interface IFormMetaData {
  name: string;
  label: string;
}

const formMetaData: IFormMetaData[] = [
  {
    name: "fullname",
    label: "Full Name",
  },
  {
    name: "username",
    label: "Username",
  },
  {
    name: "website",
    label: "Portfolio Link",
  },

  {
    name: "location",
    label: "Location",
  },

  {
    name: "bio",
    label: "Bio",
  },
];

const Profile = ({ mongoUser }: ProfileProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      fullname: mongoUser?.name,
      username: mongoUser?.username,
      website: mongoUser?.website,
      location: mongoUser?.location,
      bio: mongoUser?.bio,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    try {
      setIsSubmitting(true);
      await updateProfile({
        updateData: {
          fullname: values.fullname,
          username: values.username,
          website: values.website,
          location: values.location,
          bio: values.bio,
        },
        clerkId: mongoUser.clerkId,
        path: pathname,
      });

      router.push(`/`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10 space-y-8">
        {formMetaData.map((item) => (
          <FormField
            control={form.control}
            name={item.name as "fullname" | "username" | "website" | "location" | "bio"}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-semibold text-dark400_light800 ">
                  {item.label}
                  <span className="text-red-500">*</span>{" "}
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input className="background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border" {...field} />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        ))}

        <Button disabled={isSubmitting} type="submit" className="primary-gradient w-fit !text-light-900 disabled:bg-gray-400">
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default Profile;
