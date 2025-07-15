"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  taskName: z.string().min(2, "Task name must be at least 2 characters.").max(50),
  assignee: z.string({
    required_error: "Please select an employee to assign this task.",
  }),
  description: z.string().optional(),
  frequency: z.enum(["once", "hourly", "daily", "weekly", "monthly"], {
    required_error: "Please select a frequency.",
  }),
  runDate: z.date().optional(),
  minute: z.string().regex(/^([0-5]?[0-9])$/, "Minute must be between 0 and 59."),
  hour: z.string().regex(/^([01]?[0-9]|2[0-3])$/, "Hour must be between 0 and 23.").optional(),
  daysOfWeek: z.array(z.string()).optional(),
  dayOfMonth: z.string().regex(/^([1-9]|[12][0-9]|3[01])$/, "Day must be between 1 and 31.").optional(),
}).refine(data => {
    if (data.frequency === 'once' && !data.runDate) {
        return false;
    }
    return true;
}, {
    message: "Please select a date for a one-time task.",
    path: ["runDate"],
});


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
      hour: "9",
      dayOfMonth: "1",
      daysOfWeek: [],
    },
  })

  const frequency = form.watch("frequency");

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Reconstruct cron string from form values
    let schedule = "";
    const { minute, hour, dayOfMonth, daysOfWeek, frequency, runDate } = values;

    if (frequency === "once" && runDate) {
        schedule = `${minute} ${hour} ${runDate.getDate()} ${runDate.getMonth() + 1} *`;
    } else if (frequency === "hourly") {
        schedule = `${minute} * * * *`;
    } else if (frequency === "daily") {
        schedule = `${minute} ${hour} * * *`;
    } else if (frequency === "weekly") {
        schedule = `${minute} ${hour} * * ${daysOfWeek?.join(",")}`;
    } else if (frequency === "monthly") {
        schedule = `${minute} ${hour} ${dayOfMonth} * *`;
    }
    
    console.log({ ...values, schedule });

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
                          <SelectItem value="once">Once</SelectItem>
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

                {frequency === 'once' && (
                  <FormField
                    control={form.control}
                    name="runDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0,0,0,0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minute</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select minute" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 60 }, (_, i) => i.toString()).map(minute => (
                                <SelectItem key={minute} value={minute}>{minute}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select hour" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => i.toString()).map(hour => (
                                    <SelectItem key={hour} value={hour}>{hour}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                        <div className="grid grid-cols-4 gap-2 rounded-lg border p-2">
                        {days.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="daysOfWeek"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.id}
                                  className="flex flex-row items-center space-x-2 space-y-0"
                                >
                                  <FormControl>
                                     <Button
                                      variant={field.value?.includes(item.id) ? "default" : "outline"}
                                      size="sm"
                                      type="button"
                                      onClick={() => {
                                        const newValues = field.value?.includes(item.id)
                                          ? field.value?.filter(v => v !== item.id)
                                          : [...(field.value || []), item.id];
                                        field.onChange(newValues);
                                      }}
                                      className="w-full"
                                    >
                                      {item.label}
                                    </Button>
                                  </FormControl>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(day => (
                                    <SelectItem key={day} value={day}>{day}</SelectItem>
                                ))}
                            </SelectContent>
                           </Select>
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
