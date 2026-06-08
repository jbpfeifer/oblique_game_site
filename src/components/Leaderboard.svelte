<script lang="ts">
  import { onMount } from 'svelte';
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  const leaderboardSchema = 'oblique_leaderboard';
  const monthlyLeaderboardTable = 'season_scores';
  const allTimeLeaderboardTable = 'entries';

  const supabase =
    supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

  type LeaderboardMode = 'monthly' | 'allTime';

  interface ScoreEntry {
    player_name: string;
    score: number;
    created_at: string;
  }

  const leaderboardModes: Array<{
    id: LeaderboardMode;
    label: string;
    description: string;
  }> = [
    {
      id: 'monthly',
      label: 'Monat',
      description: 'Aktuelle Season',
    },
    {
      id: 'allTime',
      label: 'All Time',
      description: 'Dauerhafte Bestwerte',
    },
  ];

  let activeMode: LeaderboardMode = 'monthly';
  let scoresByMode: Record<LeaderboardMode, ScoreEntry[]> = {
    monthly: [],
    allTime: [],
  };
  let loading = true;
  let error: string | null = null;

  $: scores = scoresByMode[activeMode];
  let scores: ScoreEntry[] = [];

  function getErrorMessage(cause: unknown) {
    if (cause instanceof Error && cause.message) return cause.message;

    if (cause && typeof cause === 'object') {
      const maybeMessage = 'message' in cause ? cause.message : null;
      const maybeDetails = 'details' in cause ? cause.details : null;
      const maybeHint = 'hint' in cause ? cause.hint : null;

      const parts = [maybeMessage, maybeDetails, maybeHint].filter(
        (value): value is string => typeof value === 'string' && value.trim().length > 0,
      );

      if (parts.length > 0) return parts.join(' | ');
    }

    if (typeof cause === 'string' && cause.trim().length > 0) return cause;

    return 'Leaderboard konnte nicht geladen werden.';
  }

  function formatDate(input: string) {
    const date = new Date(input);
    return Number.isNaN(date.getTime())
      ? ''
      : new Intl.DateTimeFormat('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }).format(date);
  }

  function getLeaderboardTable(mode: LeaderboardMode) {
    return mode === 'monthly' ? monthlyLeaderboardTable : allTimeLeaderboardTable;
  }

  async function loadScores(mode: LeaderboardMode) {
    if (!supabase) {
      throw new Error('Supabase-Konfiguration fehlt.');
    }

    const { data, error: sbError } = await supabase
      .schema(leaderboardSchema)
      .from(getLeaderboardTable(mode))
      .select('player_name, score, created_at')
      .order('score', { ascending: false })
      .limit(1000);

    if (sbError) {
      throw sbError;
    }

    return data ?? [];
  }

  onMount(async () => {
    if (!supabase) {
      error = 'Supabase-Konfiguration fehlt.';
      loading = false;
      return;
    }

    try {
      const [monthlyScores, allTimeScores] = await Promise.all([
        loadScores('monthly'),
        loadScores('allTime'),
      ]);

      scoresByMode = {
        monthly: monthlyScores,
        allTime: allTimeScores,
      };
    } catch (e) {
      console.error('Leaderboard load failed', e);
      error = getErrorMessage(e);
    } finally {
      loading = false;
    }
  });
</script>

<section class="w-full bg-[#151515]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.38)] backdrop-blur-sm sm:p-6">
  <div class="flex flex-col gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p class="text-[11px] uppercase tracking-[0.3em] text-white/38">Live-Leaderboard</p>
      <h2 class="mt-2 text-2xl font-medium text-[#f2f2f2]" style="font-family: Georgia, 'Times New Roman', serif;">Monatsranking und All-Time-Ranking</h2>
    </div>
    <span class="inline-flex w-fit items-center gap-2 bg-[#00b8a9]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#00b8a9]">
      <span class="h-2 w-2 rounded-full bg-[#00b8a9]"></span>
      Daten aus dem Spiel
    </span>
  </div>

  <div class="mt-5 flex flex-wrap gap-2">
    {#each leaderboardModes as mode}
      <button
        type="button"
        class={`inline-flex min-h-12 items-center gap-3 border px-4 py-3 text-left text-sm font-semibold transition-colors ${
          activeMode === mode.id
            ? 'border-[#00b8a9] bg-[#00b8a9]/12 text-white'
            : 'border-white/8 bg-[#1b1b1b] text-white/72 hover:border-white/14 hover:bg-[#222222] hover:text-white'
        }`}
        on:click={() => {
          activeMode = mode.id;
        }}
      >
        <span class={`h-2.5 w-2.5 rounded-full ${activeMode === mode.id ? 'bg-[#00b8a9]' : 'bg-white/18'}`}></span>
        <span class="flex flex-col">
          <span>{mode.label}</span>
          <span class={`text-[11px] uppercase tracking-[0.16em] ${activeMode === mode.id ? 'text-[#00b8a9]' : 'text-white/38'}`}>
            {mode.description}
          </span>
        </span>
      </button>
    {/each}
  </div>

  {#if loading}
    <div class="flex items-center justify-center gap-3 py-14 text-sm text-white/48">
      <span class="h-5 w-5 animate-spin rounded-full border-2 border-[#00b8a9] border-t-transparent"></span>
      Lade Leaderboards...
    </div>
  {:else if error}
    <div class="mt-4 bg-red-950/28 p-4 text-sm text-red-200">
      Fehler beim Laden: {error}
    </div>
  {:else if scores.length === 0}
    <div class="mt-4 bg-[#1b1b1b] p-4 text-sm text-white/60">
      In diesem Ranking sind noch keine Eintraege vorhanden.
    </div>
  {:else}
    <div class="mt-4 text-sm leading-7 text-white/54">
      {#if activeMode === 'monthly'}
        Dieses Ranking zeigt die besten Scores des aktuell laufenden Season-Monats.
      {:else}
        Dieses Ranking zeigt pro Spieler den besten dauerhaft gespeicherten Score.
      {/if}
    </div>
    <div class="mt-5 max-h-[560px] overflow-auto pr-1">
      <table class="w-full border-collapse text-left text-sm">
        <thead class="sticky top-0 z-10 bg-[#151515]">
          <tr class="border-b border-white/5 text-[11px] uppercase tracking-[0.24em] text-white/38">
            <th class="w-20 px-2 py-3 font-medium">Rang</th>
            <th class="px-2 py-3 font-medium">Spieler</th>
            <th class="px-2 py-3 text-right font-medium">Score</th>
            <th class="px-2 py-3 text-right font-medium">Datum</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          {#each scores as entry, index}
            <tr class="transition-colors hover:bg-white/[0.02]">
              <td class="px-2 py-3 align-middle font-mono text-white/64">
                <span class="inline-flex h-8 min-w-8 items-center justify-center bg-[#1d1d1d] px-2 text-xs font-semibold">
                  {#if index === 0}1{:else if index === 1}2{:else if index === 2}3{:else}{index + 1}{/if}
                </span>
              </td>
              <td class="px-2 py-3 align-middle font-medium text-[#f0f0f0]">{entry.player_name}</td>
              <td class="px-2 py-3 align-middle text-right font-mono text-base font-semibold text-[#00b8a9]">{entry.score}</td>
              <td class="px-2 py-3 align-middle text-right text-xs text-white/36">{formatDate(entry.created_at)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>
