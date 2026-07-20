import time
from typing import Dict, Any
from dataclasses import dataclass, field

@dataclass
class ObservabilityMetrics:
    total_requests: int = 0
    total_prompt_tokens: int = 0
    total_completion_tokens: int = 0
    total_cost_usd: float = 0.0
    cache_hits: int = 0
    cache_misses: int = 0
    total_tool_calls: int = 0
    errors: int = 0

    def record_chat(
        self,
        prompt_tokens: int,
        completion_tokens: int,
        cost: float,
        cache_hit: bool = False,
        tool_count: int = 0
    ):
        self.total_requests += 1
        self.total_prompt_tokens += prompt_tokens
        self.total_completion_tokens += completion_tokens
        self.total_cost_usd += cost
        self.total_tool_calls += tool_count
        if cache_hit:
            self.cache_hits += 1
        else:
            self.cache_misses += 1

    def to_dict(self) -> Dict[str, Any]:
        return {
            "total_requests": self.total_requests,
            "total_prompt_tokens": self.total_prompt_tokens,
            "total_completion_tokens": self.total_completion_tokens,
            "total_tokens": self.total_prompt_tokens + self.total_completion_tokens,
            "total_cost_usd": round(self.total_cost_usd, 6),
            "cache_hits": self.cache_hits,
            "cache_misses": self.cache_misses,
            "cache_hit_ratio": round(self.cache_hits / max(1, self.total_requests), 4),
            "total_tool_calls": self.total_tool_calls,
            "errors": self.errors
        }

metrics_tracker = ObservabilityMetrics()
