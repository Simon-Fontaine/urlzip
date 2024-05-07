import { createAdminClient } from "@/utils/supabase/admin";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const alias = searchParams.get("alias");

  if (alias) {
    const supabase = createAdminClient();

    const { data: shortenUrlsData, error: shortenUrlsError } = await supabase
      .from("shorten_urls")
      .select()
      .eq("alias", alias)
      .maybeSingle();

    if (shortenUrlsError) {
      return NextResponse.json(
        { error: shortenUrlsError.message },
        { status: 500 },
      );
    }

    if (shortenUrlsData) {
      const { data: subscriptionData, error: subscriptionError } =
        await supabase
          .from("subscriptions")
          .select("*, prices(*, products(*))")
          .in("status", ["trialing", "active"])
          .eq("user_id", shortenUrlsData.user_id)
          .maybeSingle();

      const response = {
        shorten_urls: shortenUrlsData,
        subscriptions: subscriptionData,
      };

      return NextResponse.json(response);
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ error: "Missing alias" }, { status: 400 });
}
