import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TrackingEntry {
  trackingId: string;
  recipientEmail: string;
  subject: string;
  isOpened: boolean;
  totalOpens: number;
  firstOpenedAt: string | null;
  lastOpenedAt: string | null;
  createdAt: string;
}

const trackingData: TrackingEntry[] = [
  {
    trackingId: "abc123",
    recipientEmail: "bob@example.com",
    subject: "Welcome to our service",
    isOpened: true,
    totalOpens: 2,
    firstOpenedAt: "2025-06-03T09:12:00Z",
    lastOpenedAt: "2025-06-03T10:01:00Z",
    createdAt: "2025-06-03T09:00:00Z",
  },
  {
    trackingId: "def456",
    recipientEmail: "alice@example.com",
    subject: "June Newsletter",
    isOpened: false,
    totalOpens: 0,
    firstOpenedAt: null,
    lastOpenedAt: null,
    createdAt: "2025-06-03T11:20:00Z",
  },
];

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString();
}

export default function Analytics() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Analytics</h1>
      <Table>
        <TableCaption>Tracked email performance by recipient.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Recipient</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Opens</TableHead>
            <TableHead>First Opened</TableHead>
            <TableHead>Last Opened</TableHead>
            <TableHead>Sent At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trackingData.map((entry) => (
            <TableRow key={entry.trackingId}>
              <TableCell>{entry.recipientEmail}</TableCell>
              <TableCell>{entry.subject}</TableCell>
              <TableCell>
                <Badge variant={entry.isOpened ? "default" : "secondary"}>
                  {entry.isOpened ? "Opened" : "Unopened"}
                </Badge>
              </TableCell>
              <TableCell>{entry.totalOpens}</TableCell>
              <TableCell>{formatDate(entry.firstOpenedAt)}</TableCell>
              <TableCell>{formatDate(entry.lastOpenedAt)}</TableCell>
              <TableCell>{formatDate(entry.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
