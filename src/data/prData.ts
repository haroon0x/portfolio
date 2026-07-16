export type PullRequestStatus = 'Merged' | 'Open' | 'Closed';

export interface PullRequest {
  title: string;
  repo: string;
  url: string;
  description: string;
  status: PullRequestStatus;
  date: string;
  additions: number;
  deletions: number;
  languages: string[];
}

export interface PRData {
  prs: PullRequest[];
  lastUpdated: string;
  total: number;
  open: number;
  merged: number;
}

let dataRequest: Promise<PRData> | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPullRequest(value: unknown): value is PullRequest {
  if (!isRecord(value)) return false;

  return (
    typeof value.title === 'string' &&
    typeof value.repo === 'string' &&
    typeof value.url === 'string' &&
    typeof value.description === 'string' &&
    (value.status === 'Merged' || value.status === 'Open' || value.status === 'Closed') &&
    typeof value.date === 'string' &&
    typeof value.additions === 'number' &&
    typeof value.deletions === 'number' &&
    Array.isArray(value.languages) &&
    value.languages.every((language) => typeof language === 'string')
  );
}

function parsePRData(value: unknown): PRData {
  if (
    !isRecord(value) ||
    !Array.isArray(value.prs) ||
    !value.prs.every(isPullRequest) ||
    typeof value.lastUpdated !== 'string' ||
    typeof value.total !== 'number' ||
    typeof value.open !== 'number' ||
    typeof value.merged !== 'number' ||
    value.total !== value.prs.length
  ) {
    throw new Error('Pull request data has an invalid schema');
  }

  return value as unknown as PRData;
}

export function loadPRData(): Promise<PRData> {
  if (!dataRequest) {
    dataRequest = fetch('/pr-data.json')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load pull request data');
        return response.json() as Promise<unknown>;
      })
      .then(parsePRData)
      .catch((error: unknown) => {
        dataRequest = null;
        throw error;
      });
  }

  return dataRequest;
}
