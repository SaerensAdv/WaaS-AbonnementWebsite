const CLICKUP_BASE_URL = "https://api.clickup.com/api/v2";

export const CLICKUP_LISTS = {
  BACKLOG: "901522317212",
  SPRINT: "901522317213",
  BUGS: "901522317214",
  RELEASES: "901522317217",
  KLANTEN: "901522317218",
  SUPPORT_TICKETS: "901522317219",
  FEEDBACK: "901522317220",
  AANVRAGEN: "901522317221",
} as const;

export const CLICKUP_SPACE_ID = "901510164504";
export const CLICKUP_TEAM_ID = "9015913612";

function getHeaders(): Record<string, string> {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    throw new Error("CLICKUP_API_TOKEN environment variable is not set");
  }
  return {
    Authorization: token,
    "Content-Type": "application/json",
  };
}

async function clickupFetch(path: string, options: RequestInit = {}): Promise<any> {
  const url = `${CLICKUP_BASE_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`ClickUp API error [${response.status}]: ${errorText}`);
    throw new Error(`ClickUp API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export interface CreateTaskInput {
  name: string;
  description?: string;
  status?: string;
  priority?: 1 | 2 | 3 | 4;
  tags?: string[];
  dueDate?: number;
  timeEstimate?: number;
}

export async function createTask(listId: string, task: CreateTaskInput): Promise<any> {
  return clickupFetch(`/list/${listId}/task`, {
    method: "POST",
    body: JSON.stringify({
      name: task.name,
      description: task.description || "",
      status: task.status || "to do",
      priority: task.priority || 3,
      tags: task.tags || [],
      due_date: task.dueDate || undefined,
      time_estimate: task.timeEstimate || undefined,
    }),
  });
}

export async function getTasks(listId: string, options?: {
  statuses?: string[];
  page?: number;
  includeSubtasks?: boolean;
}): Promise<any> {
  const params = new URLSearchParams();
  if (options?.statuses) {
    options.statuses.forEach(s => params.append("statuses[]", s));
  }
  if (options?.page !== undefined) {
    params.set("page", String(options.page));
  }
  if (options?.includeSubtasks) {
    params.set("include_subtasks", "true");
  }
  const query = params.toString();
  return clickupFetch(`/list/${listId}/task${query ? `?${query}` : ""}`);
}

export async function getTask(taskId: string): Promise<any> {
  return clickupFetch(`/task/${taskId}`);
}

export async function updateTask(taskId: string, updates: Partial<CreateTaskInput>): Promise<any> {
  const body: any = {};
  if (updates.name) body.name = updates.name;
  if (updates.description !== undefined) body.description = updates.description;
  if (updates.status) body.status = updates.status;
  if (updates.priority) body.priority = updates.priority;
  if (updates.tags) body.tags = updates.tags;
  if (updates.dueDate) body.due_date = updates.dueDate;

  return clickupFetch(`/task/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function addComment(taskId: string, commentText: string): Promise<any> {
  return clickupFetch(`/task/${taskId}/comment`, {
    method: "POST",
    body: JSON.stringify({ comment_text: commentText }),
  });
}

export async function getComments(taskId: string): Promise<any> {
  return clickupFetch(`/task/${taskId}/comment`);
}

export async function createChecklist(taskId: string, name: string): Promise<any> {
  return clickupFetch(`/task/${taskId}/checklist`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function isClickUpConfigured(): boolean {
  return !!process.env.CLICKUP_API_TOKEN;
}

export async function createKlantTask(
  customerName: string,
  email: string,
  planName: string,
  companyName?: string,
): Promise<any> {
  const description = [
    `**Klant:** ${customerName}`,
    `**Email:** ${email}`,
    `**Plan:** ${planName}`,
    companyName ? `**Bedrijf:** ${companyName}` : null,
    "",
    `Aangemaakt op: ${new Date().toLocaleDateString("nl-NL")}`,
  ].filter(Boolean).join("\n");

  return createTask(CLICKUP_LISTS.KLANTEN, {
    name: `${customerName} — ${planName}`,
    description,
    tags: ["klant", planName.toLowerCase()],
    priority: 3,
  });
}

export async function createAanvraagTask(
  name: string,
  email: string,
): Promise<any> {
  const description = [
    `**Naam:** ${name}`,
    `**Email:** ${email}`,
    "",
    `Ingeschreven op: ${new Date().toLocaleDateString("nl-NL")}`,
  ].join("\n");

  return createTask(CLICKUP_LISTS.AANVRAGEN, {
    name: `Nieuwe inschrijving — ${name}`,
    description,
    tags: ["inschrijving"],
    priority: 3,
  });
}

export async function createMaatwerkQuoteTask(
  companyName: string,
  contactName: string,
  email: string,
  phone: string | null,
  projectType: string,
  budgetRange: string | null,
  description: string,
  currentWebsite: string | null,
  details?: Record<string, any> | null,
): Promise<any> {
  const projectTypeLabels: Record<string, string> = {
    "ecommerce": "E-commerce / Webshop",
    "multilingual": "Meertalige website",
    "booking": "Boekings- / reserveringssysteem",
    "custom-integration": "Custom integraties & API's",
    "redesign": "Volledige redesign",
    "other": "Anders",
  };

  const budgetLabels: Record<string, string> = {
    "1000-2500": "€1.000 – €2.500",
    "2500-5000": "€2.500 – €5.000",
    "5000-10000": "€5.000 – €10.000",
    "10000+": "€10.000+",
    "unknown": "Nog geen idee",
  };

  const d = details || {};

  const desc = [
    "## Contactgegevens",
    `**Bedrijf:** ${companyName}`,
    `**Contactpersoon:** ${contactName}`,
    `**Email:** ${email}`,
    phone ? `**Telefoon:** ${phone}` : null,
    d.vatNumber ? `**BTW-nummer:** ${d.vatNumber}` : null,
    d.companySize ? `**Bedrijfsgrootte:** ${d.companySize}` : null,
    d.sector ? `**Sector:** ${d.sector}` : null,
    "",
    "## Projectdetails",
    `**Type project:** ${projectTypeLabels[projectType] || projectType}`,
    currentWebsite ? `**Huidige website:** ${currentWebsite}` : null,
    d.targetAudience ? `**Doelgroep:** ${d.targetAudience}` : null,
    d.estimatedPages ? `**Geschat aantal pagina's:** ${d.estimatedPages}` : null,
    d.desiredFeatures?.length ? `**Gewenste functies:** ${d.desiredFeatures.join(", ")}` : null,
    d.competitors ? `**Concurrenten / voorbeelden:** ${d.competitors}` : null,
    "",
    "## Design & Content",
    d.designStyle ? `**Stijlvoorkeur:** ${d.designStyle}` : null,
    d.exampleWebsites ? `**Voorbeeldwebsites:** ${d.exampleWebsites}` : null,
    d.brandColors ? `**Merkkleuren:** ${d.brandColors}` : null,
    d.hasLogo !== undefined ? `**Logo beschikbaar:** ${d.hasLogo ? "Ja" : "Nee"}` : null,
    d.contentReady ? `**Content status:** ${d.contentReady}` : null,
    d.languages?.length ? `**Talen:** ${d.languages.join(", ")}` : null,
    "",
    "## Planning & Budget",
    budgetRange ? `**Budget indicatie:** ${budgetLabels[budgetRange] || budgetRange}` : null,
    d.deadline ? `**Gewenste lanceerdatum:** ${d.deadline}` : null,
    d.urgency ? `**Urgentie:** ${d.urgency}` : null,
    d.maintenancePlan ? `**Onderhoud gewenst:** ${d.maintenancePlan}` : null,
    "",
    "---",
    "",
    "## Projectbeschrijving",
    description,
    d.additionalNotes ? `\n## Extra opmerkingen\n${d.additionalNotes}` : null,
    "",
    `Aangevraagd op: ${new Date().toLocaleDateString("nl-NL")}`,
  ].filter(Boolean).join("\n");

  return createTask(CLICKUP_LISTS.AANVRAGEN, {
    name: `Maatwerk offerte — ${companyName}`,
    description: desc,
    tags: ["maatwerk", "offerte"],
    priority: 2,
  });
}

export async function createOnboardingSprintTask(
  customerName: string,
  planName: string,
  onboardingData: any,
): Promise<any> {
  const data = onboardingData || {};

  const goalLabels: Record<string, string> = {
    "more-customers": "Meer klanten aantrekken",
    "information": "Informatie verstrekken",
    "online-sales": "Online verkoop / reserveringen",
    "portfolio": "Portfolio / showcase",
    "branding": "Merkbekendheid vergroten",
    "other": "Anders",
  };

  const styleLabels: Record<string, string> = {
    "modern": "Modern / Minimalistisch",
    "classic": "Klassiek / Traditioneel",
    "playful": "Speels / Creatief",
    "corporate": "Zakelijk / Corporate",
  };

  const contentLabels: Record<string, string> = {
    "yes": "Ja",
    "partial": "Gedeeltelijk",
    "no": "Nee",
  };

  const lines = [
    `**Klant:** ${customerName}`,
    `**Plan:** ${planName}`,
    "",
    "---",
    "",
    "## 1. Bedrijfsgegevens",
  ];

  if (data.companyName) lines.push(`**Bedrijfsnaam:** ${data.companyName}`);
  if (data.country) lines.push(`**Land:** ${data.country === "NL" ? "Nederland" : data.country === "BE" ? "België" : data.country}`);
  if (data.kvkNumber) lines.push(`**KVK-nummer:** ${data.kvkNumber}`);
  if (data.btwNumber) lines.push(`**BTW-nummer:** ${data.btwNumber}`);
  if (data.industry) lines.push(`**Branche:** ${data.industry}`);
  if (data.existingWebsite) lines.push(`**Bestaande website:** ${data.existingWebsite}`);
  if (data.phone) lines.push(`**Telefoon:** ${data.phone}`);
  if (data.address) lines.push(`**Adres:** ${data.address}`);

  lines.push("", "## 2. Website doelen");

  if (data.websiteGoals && Array.isArray(data.websiteGoals) && data.websiteGoals.length > 0) {
    const goals = data.websiteGoals.map((g: string) => goalLabels[g] || g);
    lines.push(`**Doelen:** ${goals.join(", ")}`);
  }
  if (data.targetAudience) lines.push(`**Doelgroep:** ${data.targetAudience}`);
  if (data.competitors) lines.push(`**Concurrenten:** ${data.competitors}`);

  lines.push("", "## 3. Content");

  if (data.hasTexts) lines.push(`**Teksten beschikbaar:** ${contentLabels[data.hasTexts] || data.hasTexts}`);
  if (data.hasLogo) lines.push(`**Logo beschikbaar:** ${contentLabels[data.hasLogo] || data.hasLogo}`);
  if (data.hasPhotos) lines.push(`**Foto's beschikbaar:** ${contentLabels[data.hasPhotos] || data.hasPhotos}`);

  lines.push("", "## 4. Design");

  if (data.colorPreference) lines.push(`**Kleurvoorkeur:** ${data.colorPreference}`);
  if (data.stylePreference) lines.push(`**Stijlvoorkeur:** ${styleLabels[data.stylePreference] || data.stylePreference}`);
  if (data.exampleWebsites) lines.push(`**Voorbeeldwebsites:** ${data.exampleWebsites}`);

  lines.push("", "## 5. Social media & opmerkingen");

  if (data.facebookUrl) lines.push(`**Facebook:** ${data.facebookUrl}`);
  if (data.instagramUrl) lines.push(`**Instagram:** ${data.instagramUrl}`);
  if (data.linkedinUrl) lines.push(`**LinkedIn:** ${data.linkedinUrl}`);
  if (data.notes) lines.push(`**Opmerkingen:** ${data.notes}`);

  lines.push("", "---", `Onboarding afgerond op: ${new Date().toLocaleDateString("nl-NL")}`);

  return createTask(CLICKUP_LISTS.SPRINT, {
    name: `Website bouwen — ${data.companyName || customerName}`,
    description: lines.join("\n"),
    tags: ["onboarding", "website-build"],
    priority: 2,
  });
}

export async function createSupportTicketTask(
  customerName: string,
  email: string,
  userId: string,
  subject: string,
  message: string,
  priority: 1 | 2 | 3 | 4 = 3,
): Promise<any> {
  const description = [
    `**Klant:** ${customerName}`,
    `**Email:** ${email}`,
    `**User ID:** ${userId}`,
    "",
    "## Beschrijving",
    message,
    "",
    `Ingediend op: ${new Date().toLocaleDateString("nl-NL")}`,
  ].join("\n");

  return createTask(CLICKUP_LISTS.SUPPORT_TICKETS, {
    name: `${subject}`,
    description,
    tags: ["support", `uid:${userId}`],
    priority,
  });
}

export async function createPopupLeadTask(
  name: string,
  email: string,
  message?: string,
): Promise<any> {
  const description = [
    `**Naam:** ${name}`,
    `**Email:** ${email}`,
    "",
    "## Vraag",
    message || "_Geen vraag ingevuld_",
    "",
    "---",
    `Bron: Website popup formulier`,
    `Ingediend op: ${new Date().toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`,
  ].join("\n");

  return createTask(CLICKUP_LISTS.AANVRAGEN, {
    name: `Lead: ${name} — ${email}`,
    description,
    tags: ["popup-lead", "website"],
    priority: 3,
  });
}

export async function getTasksByTag(listId: string, tag: string): Promise<any[]> {
  const result = await getTasks(listId);
  const tasks = result.tasks || [];
  return tasks.filter((task: any) =>
    (task.tags || []).some((t: any) => t.name === tag)
  );
}
