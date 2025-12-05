import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  UserCog,
  CheckCircle2,
  Clock,
  Loader2,
  Save,
} from "lucide-react";
import type { SpecialistProfile } from "@shared/schema";

const skillOptions = [
  "Google Ads",
  "Meta Ads",
  "SEO",
  "Content Marketing",
  "Local SEO",
  "Google Analytics",
  "Conversion Optimization",
];

const languageOptions = ["Nederlands", "Engels", "Duits", "Frans", "Spaans"];

const nicheOptions = [
  "E-commerce",
  "B2B",
  "Healthcare",
  "Finance",
  "Real Estate",
  "Travel",
  "Education",
  "Technology",
];

const profileSchema = z.object({
  skills: z.array(z.string()).min(1, "Selecteer minstens één skill"),
  languages: z.array(z.string()).min(1, "Selecteer minstens één taal"),
  niches: z.array(z.string()),
  capacity: z.number().min(1).max(20),
  bio: z.string().max(500).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileResponse {
  profile: SpecialistProfile | null;
}

export default function SpecialistProfilePage() {
  const { toast } = useToast();

  const { data, isLoading } = useQuery<ProfileResponse>({
    queryKey: ["/api/specialist/profile"],
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      skills: [],
      languages: [],
      niches: [],
      capacity: 5,
      bio: "",
    },
    values: data?.profile ? {
      skills: data.profile.skills || [],
      languages: data.profile.languages || [],
      niches: data.profile.niches || [],
      capacity: data.profile.capacity || 5,
      bio: data.profile.bio || "",
    } : undefined,
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: ProfileFormData) => {
      const response = await apiRequest("PUT", "/api/specialist/profile", formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/specialist/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/specialist/dashboard"] });
      toast({
        title: "Profiel bijgewerkt",
        description: "Uw wijzigingen zijn opgeslagen.",
      });
    },
    onError: () => {
      toast({
        title: "Fout",
        description: "Kon profiel niet bijwerken.",
        variant: "destructive",
      });
    },
  });

  const profile = data?.profile;

  const onSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <AppLayout
        title="Mijn Profiel"
        breadcrumbs={[{ label: "Specialist", href: "/specialist" }, { label: "Profiel" }]}
      >
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Mijn Profiel"
      breadcrumbs={[{ label: "Specialist", href: "/specialist" }, { label: "Profiel" }]}
    >
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-semibold">Mijn Profiel</h1>
          <p className="text-muted-foreground">
            Beheer uw specialistenprofiel en voorkeuren.
          </p>
        </div>

        <Card className="border">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                  <UserCog className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Accountstatus</CardTitle>
                  <CardDescription>Uw huidige goedkeuringsstatus</CardDescription>
                </div>
              </div>
              {profile?.approved ? (
                <Badge variant="secondary" className="bg-chart-2/20 text-chart-2">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Goedgekeurd
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-chart-4/20 text-chart-4">
                  <Clock className="h-3 w-3 mr-1" />
                  Wachtend op goedkeuring
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle className="text-lg">Profielgegevens</CardTitle>
            <CardDescription>
              Vul uw expertise en voorkeuren in zodat we u kunnen matchen met geschikte klanten.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="skills"
                  render={() => (
                    <FormItem>
                      <FormLabel>Skills & Expertise</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {skillOptions.map((skill) => (
                          <FormField
                            key={skill}
                            control={form.control}
                            name="skills"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(skill)}
                                    onCheckedChange={(checked) => {
                                      const updated = checked
                                        ? [...field.value, skill]
                                        : field.value.filter((s) => s !== skill);
                                      field.onChange(updated);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {skill}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="languages"
                  render={() => (
                    <FormItem>
                      <FormLabel>Talen</FormLabel>
                      <div className="flex flex-wrap gap-3">
                        {languageOptions.map((language) => (
                          <FormField
                            key={language}
                            control={form.control}
                            name="languages"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(language)}
                                    onCheckedChange={(checked) => {
                                      const updated = checked
                                        ? [...field.value, language]
                                        : field.value.filter((l) => l !== language);
                                      field.onChange(updated);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {language}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="niches"
                  render={() => (
                    <FormItem>
                      <FormLabel>Niches (optioneel)</FormLabel>
                      <FormDescription>
                        Selecteer branches waarin u ervaring heeft.
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {nicheOptions.map((niche) => (
                          <FormField
                            key={niche}
                            control={form.control}
                            name="niches"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(niche)}
                                    onCheckedChange={(checked) => {
                                      const updated = checked
                                        ? [...field.value, niche]
                                        : field.value.filter((n) => n !== niche);
                                      field.onChange(updated);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {niche}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximale capaciteit</FormLabel>
                      <FormDescription>
                        Hoeveel klantaccounts kunt u tegelijk beheren?
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          className="max-w-24"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                          data-testid="input-capacity"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Over mij (optioneel)</FormLabel>
                      <FormDescription>
                        Korte beschrijving van uw ervaring en aanpak.
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Beschrijf uw achtergrond en expertise..."
                          rows={4}
                          data-testid="input-bio"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save-profile">
                  {updateMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Profiel opslaan
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
