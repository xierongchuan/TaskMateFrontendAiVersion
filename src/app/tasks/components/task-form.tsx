"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  taskName: z.string().min(2, "Task name must be at least 2 characters.").max(50),
  assignee: z.string({
    required_error: "Please select an employee to assign this task.",
  }),
  description: z.string().optional(),
  frequency: z.enum(["hourly", "daily", "weekly", "monthly"], {
    required_error: "Please select a frequency.",
  }),
  minute: z.string().regex(/^([0-5]?[0-9])$/, "Minute must be between 0 and 59."),
  hour: z.string().regex(/^([01]?[0-9]|2[0-3])$/, "Hour must be between 0 and 23.").optional(),
  daysOfWeek: z.array(z.string()).optional(),
  dayOfMonth: z.string().regex(/^([1-9]|[12][0-9]|3[01])$/, "Day must be between 1 and 31.").optional(),
})

const employees = [
  { id: "1", name: "Alice Johnson" },
  { id: "2", name: "Bob Williams" },
  { id: "4", name: "Diana Miller" },
  { id: "6", name: "Fiona Garcia" },
]

const days = [
  { id: "1", label: "Mon" },
  { id: "2", label: "Tue" },
  { id: "3", label: "Wed" },
  { id: "4", label: "Thu" },
  { id: "5", label: "Fri" },
  { id: "6", label: "Sat" },
  { id: "0", label: "Sun" },
]

export default function TaskForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      minute: "0",
      daysOfWeek: [],
    },
  })

  const frequency = form.watch("frequency");

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Reconstruct cron string from form values
    let cron = "";
    const { minute, hour, dayOfMonth, daysOfWeek, frequency } = values;

    if (frequency === "hourly") {
        cron = `${minute} * * * *`;
    } else if (frequency === "daily") {
        cron = `${minute} ${hour} * * *`;
    } else if (frequency === "weekly") {
        cron = `${minute} ${hour} * * ${daysOfWeek?.join(",")}`;
    } else if (frequency === "monthly") {
        cron = `${minute} ${hour} ${dayOfMonth} * *`;
    }
    
    console.log({ ...values, schedule: cron });

    toast({
      title: "Task Scheduled!",
      description: `"${values.taskName}" has been successfully scheduled.`,
    })
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Create New Task</CardTitle>
        <CardDescription>Fill out the details below to schedule a new task.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="taskName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Weekly Report Generation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the task..." className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="assignee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign To</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an employee" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map(emp => (
                            <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select how often the task runs" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minute</FormLabel>
                        <FormControl>
                          <Input placeholder="0-59" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {frequency !== 'hourly' && (
                    <FormField
                      control={form.control}
                      name="hour"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hour</FormLabel>
                          <FormControl>
                            <Input placeholder="0-23" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {frequency === 'weekly' && (
                  <FormField
                    control={form.control}
                    name="daysOfWeek"
                    render={() => (
                      <FormItem>
                        <FormLabel>Day of the week</FormLabel>
                        <div className="flex flex-wrap gap-4">
                        {days.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="daysOfWeek"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-start space-x-2 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...(field.value || []), item.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {item.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {frequency === 'monthly' && (
                   <FormField
                      control={form.control}
                      name="dayOfMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Day of the month</FormLabel>
                          <FormControl>
                            <Input placeholder="1-31" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                )}
              </div>
            </div>

            <Button type="submit">Schedule Task</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
