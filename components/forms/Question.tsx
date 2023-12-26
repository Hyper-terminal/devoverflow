"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { QuestionSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import React, { useRef, useState } from "react";
import { Badge } from "../ui/badge";
import Image from "next/image";

const type: string = "create";

const Question = () => {
  const editorRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof QuestionSchema>) {
    setIsSubmitting(true);
    try {
      // make an async call to our api
      // navigate to home page
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleKeydown(event: React.KeyboardEvent<HTMLInputElement>, field: any) {
    if (event.key === "Enter" && field.name === "tags") {
      event.preventDefault();
      const tagInput = event.target as HTMLInputElement;

      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15)
          return form.setError("tags", {
            type: "required",
            message: "Tag cannot be more than 15 characters",
          });

        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        }
      } else {
        form.trigger();
      }
    }
  }

  function handleRemoveTag(tag: string, field: any) {
    const newTags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newTags);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10 space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 ">
                Question Title<span className="text-red-500">*</span>{" "}
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input className="background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border" {...field} />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Be specific and imagine you’re asking a question to another person
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800 ">
                Detailed Explanation of your problem <span className="text-red-500">*</span>{" "}
              </FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_API_KEY}
                  onInit={(evt, editor) => {
                    // @ts-ignore
                    editorRef.current = editor;
                  }}
                  initialValue=""
                  init={{
                    height: 350,
                    menubar: true,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "print",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "codesample",
                      "table",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "paste",
                      "code",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | formatselect | " +
                      "codesample | bold italic forecolor backcolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style: "body { font-family:Inter; font-size:16px }",
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Introduce the problem and expand on what you put in the title. Minimum 20 characters.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800 ">
                Tags <span className="text-red-500">*</span>{" "}
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    placeholder="Add tags..."
                    className="background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-[56px] border"
                    onKeyDown={(e) => handleKeydown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300  text-dark400_light500 flex items-center gap-2 rounded-md border-none p-5 px-4 py-2 capitalize"
                        >
                          {tag}
                          <Image
                            onClick={() => {
                              handleRemoveTag(tag, field);
                            }}
                            src="/assets/icons/close.svg"
                            alt="Close icon"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500">
                Add upto 3 tags to describe what your question is about. You need to press enter to add a tag.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting} type="submit" className="primary-gradient w-fit !text-light-900">
          {isSubmitting ? <>{type === "edit" ? "Editing..." : "Posting..."}</> : <>{type === "edit" ? "Edit Question" : "Ask Question"}</>}
        </Button>
      </form>
    </Form>
  );
};

export default Question;
