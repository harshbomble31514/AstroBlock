export interface RawInputs {
  name?: string
  dob: string // YYYY-MM-DD
  time: string // HH:mm
  place: string // City, Country
  question?: string
}

export interface NormalizedInputs {
  name: string
  dob: string // ISO date string
  time: string // HH:mm format
  place: string // Canonical "City, CC" format
  question: string
  timestamp: string // ISO string of when normalized
}

function trimAndCollapse(str: string): string {
  return str.trim().replace(/\s+/g, ' ')
}

function normalizePlace(place: string): string {
  // Basic place normalization - in production you'd use a geocoding service
  const cleaned = trimAndCollapse(place)
  const parts = cleaned.split(',')
  
  if (parts.length >= 2) {
    const city = trimAndCollapse(parts[0])
    const country = trimAndCollapse(parts[parts.length - 1])
    return `${city}, ${country.toUpperCase()}`
  }
  
  return cleaned
}

function normalizeDate(dateStr: string): string {
  // Ensure YYYY-MM-DD format and convert to ISO
  const cleaned = dateStr.trim()
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    throw new Error('Date must be in YYYY-MM-DD format')
  }
  
  const date = new Date(cleaned + 'T00:00:00.000Z')
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date')
  }
  
  return date.toISOString().split('T')[0]
}

function normalizeTime(timeStr: string): string {
  // Ensure HH:mm format
  const cleaned = timeStr.trim()
  if (!/^\d{1,2}:\d{2}$/.test(cleaned)) {
    throw new Error('Time must be in HH:mm format')
  }
  
  const [hours, minutes] = cleaned.split(':')
  const h = parseInt(hours, 10)
  const m = parseInt(minutes, 10)
  
  if (h < 0 || h > 23 || m < 0 || m > 59) {
    throw new Error('Invalid time')
  }
  
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

export function normalizeInputs(raw: RawInputs): NormalizedInputs {
  const normalized: NormalizedInputs = {
    name: raw.name ? trimAndCollapse(raw.name) : '',
    dob: normalizeDate(raw.dob),
    time: normalizeTime(raw.time),
    place: normalizePlace(raw.place),
    question: raw.question ? trimAndCollapse(raw.question) : '',
    timestamp: new Date().toISOString()
  }
  
  return normalized
}

// Create a stable, deterministic representation for hashing
export function getStableInputsString(inputs: NormalizedInputs): string {
  // Create object with stable key order, excluding timestamp
  const stable = {
    dob: inputs.dob,
    name: inputs.name,
    place: inputs.place,
    question: inputs.question,
    time: inputs.time
  }
  
  return JSON.stringify(stable)
}
