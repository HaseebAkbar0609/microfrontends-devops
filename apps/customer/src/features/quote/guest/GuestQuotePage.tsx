"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

import { saveProjectAPIAction, getCountriesAPIAction } from "@/api-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormCitySelect } from "@/components/form/FormCitySelect";
import { useAuthStatus } from "@/context/AuthContext";
import { resumeDraftPath } from "../constants";
import {
  clearGuestQuote, guestQuoteDefaults, guestQuoteValuesSchema,
  readGuestQuote, writeGuestQuote, type GuestQuoteValues,
} from "./guestDraft";

const fieldsByStep: Record<number, (keyof GuestQuoteValues)[]> = {
  1: ["firstName", "lastName", "email", "phone", "address", "personalCity", "postalCode"],
  2: ["projectName", "projectType", "projectAddress", "projectCity", "projectPostalCode"],
  3: ["description"],
};

const headings = ["Your details", "The project", "Describe the work", "Review your request"];

export default function GuestQuotePage() {
  const router = useRouter();
  const { isAuthenticated, isReady } = useAuthStatus();
  const form = useForm<GuestQuoteValues>({
    resolver: zodResolver(guestQuoteValuesSchema), defaultValues: guestQuoteDefaults,
    mode: "onBlur",
  });
  const [step, setStep] = useState(1);
  const [countryId, setCountryId] = useState("");
  const [ready, setReady] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [projectId, setProjectId] = useState<string | undefined>();
  const [importing, setImporting] = useState(false);
  const [importAttempt, setImportAttempt] = useState(0);
  const [error, setError] = useState("");
  const importLock = useRef(false);

  useEffect(() => {
    const draft = readGuestQuote();
    if (draft) {
      form.reset(draft.values);
      setStep(draft.step);
      setCompleted(draft.completed);
      setProjectId(draft.projectId);
    }
    setReady(true);
    void getCountriesAPIAction().then((result) => {
      const sweden = result.data?.find((country) => country.code === "SE");
      if (sweden) setCountryId(sweden.id);
    });
  }, [form]);

  useEffect(() => {
    if (!ready) return;
    const subscription = form.watch((values) => {
      writeGuestQuote({ version: 1, step, completed, projectId, values: {
        ...guestQuoteDefaults, ...values,
      } });
    });
    return () => subscription.unsubscribe();
  }, [form, ready, step, completed, projectId]);

  useEffect(() => {
    if (!ready || !isReady || !isAuthenticated || !completed || importLock.current) return;
    importLock.current = true;
    setImporting(true);
    setError("");
    void (async () => {
      const draft = readGuestQuote();
      const parsed = guestQuoteValuesSchema.safeParse(draft?.values);
      if (!draft || !parsed.success) throw new Error("The saved request is incomplete. Review the four steps again.");
      const v = parsed.data;
      let id = draft.projectId;
      if (!id) {
        const first = await saveProjectAPIAction({ step: 1, is_send: false, data: {
          first_name: v.firstName, last_name: v.lastName, mobile_number: v.phone,
          personal_email: v.email, address: v.address, city: v.personalCity,
          postal_code: v.postalCode,
        } }, { showSuccessToast: false });
        if (!first.success || !first.data?.project_id) throw new Error(first.error || "Could not import your request.");
        id = first.data.project_id;
        setProjectId(id);
        writeGuestQuote({ ...draft, projectId: id });
      }
      const second = await saveProjectAPIAction({ project_id: id, step: 2, is_send: false, data: {
        project_name: v.projectName, project_type: v.projectType,
        client_no: "", category_ids: [], project_address: v.projectAddress,
        project_contact_city: v.projectCity, project_contact_postal_code: v.projectPostalCode,
      } }, { showSuccessToast: false });
      if (!second.success) throw new Error(second.error || "Could not import your project details.");
      const third = await saveProjectAPIAction({ project_id: id, step: 3, is_send: false, data: {
        project_description: v.description, media_ids: [],
      } }, { showSuccessToast: false });
      if (!third.success) throw new Error(third.error || "Could not import your description.");
      clearGuestQuote();
      router.replace(resumeDraftPath(id));
    })().catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : "Could not import your request.");
      setImporting(false);
      importLock.current = false;
    });
  }, [ready, isReady, isAuthenticated, completed, importAttempt, router]);

  const save = (nextStep: number, isComplete = false) => {
    const draft = { version: 1 as const, step: nextStep, completed: isComplete,
      projectId, values: form.getValues() };
    if (!writeGuestQuote(draft)) {
      setError("This browser could not save your request. Allow session storage and try again.");
      return false;
    }
    setError("");
    setStep(nextStep);
    setCompleted(isComplete);
    return true;
  };

  const next = async () => {
    if (await form.trigger(fieldsByStep[step])) save(step + 1);
  };

  const continueWith = async (path: "/login" | "/register") => {
    if (!(await form.trigger())) return;
    if (!save(4, true)) return;
    if (isAuthenticated) setImportAttempt((attempt) => attempt + 1);
    else router.push(`${path}?next=%2Fcreate-offer`);
  };

  const field = (name: keyof GuestQuoteValues, label: string, type = "text") => (
    <div className="space-y-2" key={name}>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} type={type} autoComplete={name === "email" ? "email" : "on"}
        aria-invalid={!!form.formState.errors[name]} disabled={importing}
        {...form.register(name)} />
      {form.formState.errors[name] && <p role="alert" className="text-sm text-red-700">
        {form.formState.errors[name]?.message}
      </p>}
    </div>
  );

  if (!ready || importing) return (
    <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-slate-700">
      <Loader2 className="h-5 w-5 animate-spin" />{importing ? "Importing your request" : "Loading request"}
    </div>
  );

  return (
    <FormProvider {...form}>
      <main className="mx-auto w-full max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="border-b border-slate-200 pb-6">
          <p className="text-sm font-medium text-slate-500">Request a quote · {step} of 4</p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{headings[step - 1]}</h1>
        </div>
        <form onSubmit={(event) => { event.preventDefault(); if (step < 4) void next(); }}
          className="space-y-6 py-7" noValidate>
          {step === 1 && <div className="grid gap-5 sm:grid-cols-2">
            {field("firstName", "First name")}{field("lastName", "Last name")}
            {field("email", "Email", "email")}{field("phone", "Phone", "tel")}
            <div className="sm:col-span-2">{field("address", "Address")}</div>
            <div><FormCitySelect<GuestQuoteValues> name="personalCity" countryId={countryId}
              label="City" placeholder="Select city" disabled={!countryId || importing} /></div>
            {field("postalCode", "Postal code")}
          </div>}
          {step === 2 && <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">{field("projectName", "Project name")}</div>
            <div className="sm:col-span-2 space-y-2">
              <Label>Project type</Label>
              <div className="flex gap-2" role="group" aria-label="Project type">
                {(["b2c", "express"] as const).map((kind) => <Button key={kind} type="button"
                  variant={form.watch("projectType") === kind ? "default" : "outline"}
                  aria-pressed={form.watch("projectType") === kind}
                  onClick={() => form.setValue("projectType", kind)}>{kind === "b2c" ? "Standard" : "Express"}</Button>)}
              </div>
            </div>
            <div className="sm:col-span-2">{field("projectAddress", "Project address")}</div>
            <div><FormCitySelect<GuestQuoteValues> name="projectCity" countryId={countryId}
              label="Project city" placeholder="Select city" disabled={!countryId || importing} /></div>
            {field("projectPostalCode", "Project postal code")}
          </div>}
          {step === 3 && <div className="space-y-2">
            <Label htmlFor="description">What needs to be done?</Label>
            <Textarea id="description" rows={8} disabled={importing}
              aria-invalid={!!form.formState.errors.description} {...form.register("description")} />
            {form.formState.errors.description && <p role="alert" className="text-sm text-red-700">
              {form.formState.errors.description.message}</p>}
          </div>}
          {step === 4 && <div className="space-y-5 text-sm text-slate-700">
            <div className="grid gap-4 border-b border-slate-200 pb-5 sm:grid-cols-2">
              <div><p className="text-slate-500">Contact</p><p>{form.getValues("firstName")} {form.getValues("lastName")}</p>
                <p>{form.getValues("email")}</p><p>{form.getValues("phone")}</p></div>
              <div><p className="text-slate-500">Project</p><p>{form.getValues("projectName")}</p>
                <p>{form.getValues("projectAddress")}</p></div>
            </div>
            <p className="whitespace-pre-wrap">{form.getValues("description")}</p>
            <p>Continue to save this request to your account. You can finish and send it after signing in.</p>
            {isAuthenticated ? <Button type="button" onClick={() => void continueWith("/login")}>Save to my account</Button> :
              <div className="flex flex-wrap gap-3">
                <Button type="button" onClick={() => void continueWith("/login")}>Log in</Button>
                <Button type="button" variant="outline" onClick={() => void continueWith("/register")}>Create account</Button>
              </div>}
          </div>}
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="flex items-center justify-between border-t border-slate-200 pt-5">
            {step > 1 ? <Button type="button" variant="ghost" onClick={() => save(step - 1, false)}>
              <ArrowLeft className="mr-2 h-4 w-4" />Back</Button> : <Link href="/login" className="text-sm text-slate-600 underline">Log in</Link>}
            {step < 4 && <Button type="submit">Next<ArrowRight className="ml-2 h-4 w-4" /></Button>}
          </div>
        </form>
      </main>
    </FormProvider>
  );
}
