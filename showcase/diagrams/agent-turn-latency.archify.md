# What holds up the agent's answer? {#agent-turn-latency}

In this illustrative 2.4-second turn, **the sandboxed tool call controls when synthesis can start**. Session memory and retrieval finish sooner, so speeding them up alone would not move the finish line.

@answer scope="One illustrative agent turn · not a benchmark"
@meta locale=en

## Follow the critical path {#critical-path}

@workflow id=turn-path title="The operations that determine the finish time"
| role backend | Turn stages |
| guard | Input guardrail | backend |
| plan | Select a tool | backend |
| tool | Run the tool | backend |
| answer | Synthesize the answer | backend |
| guard > plan | 80 ms |
| plan > tool | 540 ms |
| tool > answer | 860 ms |

@steps id=turn-steps
| screen | Input guardrail | The guardrail finishes at 80 ms. | turn-path | guard |
| choose | Select a tool | Planning takes 540 ms. The three branches start at 620 ms. | turn-path | plan |
| execute | Run the tool | The tool takes 860 ms, so synthesis waits until 1,480 ms. | turn-path | tool |
| respond | Synthesize the answer | The last 920 ms brings the total to 2,400 ms. | turn-path | answer |

## Which branch finishes last? {#branch-timing}

All three branches start at 620 ms. Their durations overlap; add only the longest branch to the critical path.

| Branch | Duration | Finished at |
| --- | --- | --- |
| Session memory | 90 ms | 710 ms |
| Hybrid retrieval | 420 ms | 1,040 ms |
| Sandboxed tool | 860 ms | 1,480 ms {caution:Last branch} |

The wall-clock total is `80 + 540 + 860 + 920 = 2,400 ms`.
