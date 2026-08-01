import { withProtected } from "../../src/hook/route";
import ProfileData from "../../components/User/ProfileData";
import UserFilter from "../../components/User/UserFilter";
import Link from "next/link";
import PageShell from "../../components/ui/PageShell";
import PageHeader from "../../components/ui/PageHeader";
import Section from "../../components/ui/Section";
import Button from "../../components/ui/Button";
import type { AuthContextValue } from "../../src/types/auth";

const UserPage = ({ auth }: { auth: AuthContextValue }) => {
  const user = auth.user!;

  return (
    <PageShell width="medium">
      <PageHeader
        eyebrow="Profile"
        title="Your taste"
        subtitle="Genres, streaming services, and release years shape what shows up in your swipe deck."
      />

      <div className="space-y-8">
        <Section>
          <ProfileData user={user} />
        </Section>

        <Section title="Discovery filters">
          <UserFilter user={user} />
        </Section>

        <Link href="/" className="block pt-2">
          <Button size="lg" fullWidth>
            Back to swiping
          </Button>
        </Link>
      </div>
    </PageShell>
  );
};

export default withProtected(UserPage);
