import { ShieldCheck, Lock, Ban, Network, FileLock, Wifi, Computer, Fingerprint, Smartphone, CloudCog } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const securityFeatures = [
  {
    title: "Full-Disk Encryption (FDE)",
    description: "All corporate devices are fully encrypted.",
    icon: Lock,
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "DNS Sinkholing",
    description: "Malicious domains are redirected to a safe server.",
    icon: Ban,
    status: "Enabled",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Zero Trust Network Access (ZTNA)",
    description: "Verify users and devices before granting access.",
    icon: Network,
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Endpoint Detection & Response (EDR)",
    description: "Monitors for and responds to threats on devices.",
    icon: Computer,
    status: "Monitoring",
    statusColor: "bg-blue-100 text-blue-800",
  },
  {
    title: "Data Loss Prevention (DLP)",
    description: "Prevents sensitive data from leaving the network.",
    icon: FileLock,
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Secure Access Service Edge (SASE)",
    description: "Cloud-based security for remote workers.",
    icon: Wifi,
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Virtual Desktop Infrastructure (VDI)",
    description: "Secure, centralized virtual desktops for employees.",
    icon: Computer,
    status: "Available",
    statusColor: "bg-gray-100 text-gray-800",
  },
  {
    title: "Multi-Factor Authentication (MFA)",
    description: "Context-aware MFA for all applications.",
    icon: Fingerprint,
    status: "Enforced",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Device Hardening & MDM",
    description: "Manages and secures all corporate devices.",
    icon: Smartphone,
    status: "Active",
    statusColor: "bg-green-100 text-green-800",
  },
  {
    title: "Cloud Access Security Broker (CASB)",
    description: "Monitors and secures cloud application usage.",
    icon: CloudCog,
    status: "Monitoring",
    statusColor: "bg-blue-100 text-blue-800",
  },
];

export default function SecurityPosture() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-purple-600" />
          Security Posture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {securityFeatures.map((feature) => (
            <div key={feature.title} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <div className={`p-2 ${feature.statusColor.replace('text', 'bg').split(' ')[0]} rounded-full`}>
                <feature.icon className={`h-5 w-5 ${feature.statusColor.split(' ')[1]}`} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
                <Badge className={`mt-2 ${feature.statusColor}`}>{feature.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}