---
description: Generate comprehensive static code analysis metrics report for navam-invest Python package
---

# Metrics Analysis Command

You are a code metrics analyst specializing in Python packages and AI agent systems. Your task is to perform comprehensive static code analysis on the navam-invest package and generate a detailed metrics report.

## Analysis Scope

Analyze the following aspects of the navam-invest Python package:

### 1. Code Volume Metrics
- **Total Lines of Code (LOC)**: Count all lines in source files
- **Source Lines of Code (SLOC)**: Exclude blank lines and comments
- **Lines by Language**: Break down by Python, Markdown, TOML, JSON, YAML
- **Lines by Module**: Agents, tools, workflows, TUI, cache, config, utils, tests

### 2. File and Module Metrics
- **Total Files**: Count by type (.py, .md, .toml, .json, .yaml)
- **Average File Size**: Mean lines per file
- **Largest Files**: Top 10 files by line count
- **Module Distribution**: Agents vs tools vs workflows vs TUI vs tests

### 3. Test Coverage Metrics
- **Test Files**: Count of test files in tests/ directory
- **Test Lines**: Total lines in test files
- **Test-to-Code Ratio**: Test LOC / Source LOC
- **Agent Test Coverage**: Each agent's test status
- **Tool Test Coverage**: Each API tool's test status
- **Integration Tests**: Workflow and multi-agent tests

### 4. Code Quality Metrics
- **Comment Density**: Comment lines / Total lines
- **Documentation**: Docstrings, inline comments, README files
- **Type Hints Coverage**: Functions with type annotations
- **Function Complexity**: Average function length (lines per function)
- **Error Handling**: Try-except blocks, error validation patterns
- **Code Style Compliance**: Black, Ruff, MyPy checks

### 5. Agent Architecture Metrics
- **Agent Implementations**: Count of agent files (7+ specialized agents)
- **Agent Interface Compliance**: Consistent API patterns
- **Agent-specific Code**: Lines per agent implementation
- **Tool Integration**: Tools used per agent
- **System Prompts**: Prompt engineering quality and length
- **Router Complexity**: Agent selection and delegation logic

### 6. API Integration Metrics
- **API Tool Implementations**: Financial data providers (FRED, SEC EDGAR, Alpha Vantage, etc.)
- **Tool Interface Patterns**: Unified tool API adherence
- **API Endpoints**: Count of unique endpoints per provider
- **Rate Limiting**: Implementation of rate limit handling
- **Caching Strategy**: Cache hit rates and efficiency
- **Error Recovery**: Retry logic and fallback mechanisms

### 7. LLM Integration Metrics
- **LLM Providers**: Anthropic (primary), OpenAI, Gemini, DeepSeek, Ollama support
- **Prompt Templates**: System prompts, few-shot examples
- **Token Management**: Token counting, context window optimization
- **Streaming Support**: Real-time response handling
- **Cost Tracking**: API usage monitoring
- **Model Selection**: Configuration flexibility

### 8. Feature Completeness Metrics
- **Investment Analysis**: Equity research, fundamental analysis, technical analysis
- **Portfolio Management**: Holdings tracking, allocation analysis, rebalancing
- **Risk Assessment**: Risk metrics, drawdown analysis, VAR calculations
- **Tax Optimization**: Tax-loss harvesting, wash-sale detection, lot selection
- **Multi-Agent Workflows**: Collaboration patterns, task delegation
- **TUI/CLI Interface**: Interactive chat, command system, real-time streaming
- **Data Persistence**: SQLite storage, session management, audit trails

### 9. Dependency Analysis
- **Production Dependencies**: Count from pyproject.toml
- **Core Dependencies**: anthropic, langchain, langgraph, textual
- **Financial APIs**: pandas, numpy, requests dependencies
- **Build Tools**: hatchling, setuptools
- **Dev Dependencies**: pytest, black, ruff, mypy
- **Version Constraints**: Compatibility ranges

### 10. Package Quality Metrics
- **PyPI Compatibility**: Package metadata completeness
- **Distribution Size**: Wheel and sdist sizes
- **Entry Points**: CLI commands and their implementations
- **Installation Requirements**: Python version support (3.9-3.12)
- **Documentation Quality**: README, CLAUDE.md, docs/ completeness
- **License and Legal**: License file, copyright notices

## Implementation Steps

### Step 1: Setup Metrics Directory
```bash
mkdir -p metrics
# Ensure you're in the project root directory
cd /path/to/navam-invest
```

### Step 2: Count Lines of Code
```bash
# Install cloc if needed
# brew install cloc (macOS)
# sudo apt-get install cloc (Linux)

# Run analysis for navam-invest project structure
cloc --json --exclude-dir=.venv,.git,dist,metrics,node_modules,__pycache__,.mypy_cache,.pytest_cache . > /tmp/cloc-total.json

# Analyze major modules separately
cloc --json src/navam_invest/agents/ > /tmp/cloc-agents.json
cloc --json src/navam_invest/tools/ > /tmp/cloc-tools.json
cloc --json src/navam_invest/workflows/ > /tmp/cloc-workflows.json
cloc --json src/navam_invest/tui/ > /tmp/cloc-tui.json
cloc --json src/navam_invest/cache/ > /tmp/cloc-cache.json
cloc --json src/navam_invest/config/ > /tmp/cloc-config.json
cloc --json tests/ > /tmp/cloc-tests.json
cloc --json docs/ > /tmp/cloc-docs.json
```

### Step 3: Analyze File Structure
```bash
# Count files by type
find src tests -name "*.py" | wc -l
find . -name "*.md" | wc -l
find . -name "*.toml" | wc -l
find . -name "*.json" | wc -l
find . -name "*.yaml" -o -name "*.yml" | wc -l

# Analyze directory structure
tree -L 3 src/navam_invest/ > /tmp/structure.txt
ls -lR src/navam_invest/agents/ > /tmp/agents-structure.txt
ls -lR src/navam_invest/tools/ > /tmp/tools-structure.txt
ls -lR tests/ > /tmp/tests-structure.txt
```

### Step 4: Package Metadata Analysis
```bash
# Parse pyproject.toml
cat pyproject.toml | grep "^version" | cut -d'"' -f2
cat pyproject.toml | grep "^name" | cut -d'"' -f2

# Count dependencies
grep "^[a-zA-Z]" pyproject.toml | grep -A 100 "\[project.dependencies\]" | grep "=" | wc -l
grep "^[a-zA-Z]" pyproject.toml | grep -A 100 "\[project.optional-dependencies.dev\]" | grep "=" | wc -l

# Check package distribution
ls -lh dist/ 2>/dev/null || echo "Run 'python -m build' first"
```

### Step 5: Agent Architecture Analysis
```bash
# Count agent implementations
ls -1 src/navam_invest/agents/*.py | grep -v "__" | wc -l

# Analyze agent file sizes
for agent in src/navam_invest/agents/*.py; do
  if [[ "$(basename $agent)" != "__init__.py" ]]; then
    lines=$(wc -l < "$agent")
    echo "$(basename $agent .py): $lines lines"
  fi
done

# Count system prompts
grep -r "system_prompt\|SYSTEM_PROMPT" src/navam_invest/agents/ | wc -l

# Analyze router complexity
wc -l < src/navam_invest/agents/router.py
grep -c "def.*agent" src/navam_invest/agents/router.py
```

### Step 6: API Tool Analysis
```bash
# Count tool implementations
ls -1 src/navam_invest/tools/*.py | grep -v "__init__" | wc -l

# Analyze tool file sizes
for tool in src/navam_invest/tools/*.py; do
  if [[ "$(basename $tool)" != "__init__.py" ]]; then
    lines=$(wc -l < "$tool")
    echo "$(basename $tool .py): $lines lines"
  fi
done

# Count API endpoints per tool
for tool in src/navam_invest/tools/*.py; do
  endpoint_count=$(grep -c "https://\|http://" "$tool" 2>/dev/null || echo "0")
  echo "$(basename $tool .py): $endpoint_count endpoint(s)"
done

# Check caching implementation
grep -r "cache\|Cache" src/navam_invest/cache/ | wc -l
grep -c "@cache\|@lru_cache" src/navam_invest/tools/*.py
```

### Step 7: Test Coverage Analysis
```bash
# Find all test files
find tests -name "test_*.py" -o -name "*_test.py" | wc -l

# Count test functions
grep -r "^def test_\|^async def test_" tests/ | wc -l

# Agent test coverage
for agent in quill earnings_whisperer screen_forge macro_lens news_sentry portfolio research risk_shield tax_scout hedge_smith; do
  test_files=$(find tests -name "*${agent}*" 2>/dev/null | wc -l)
  echo "$agent: $test_files test file(s)"
done

# Tool test coverage
for tool in alpha_vantage fred sec_edgar fmp finnhub tiingo newsapi yahoo_finance treasury; do
  test_files=$(find tests -name "*${tool}*" 2>/dev/null | wc -l)
  echo "$tool: $test_files test file(s)"
done

# Integration vs unit tests
find tests -name "*integration*" -o -name "*workflow*" | wc -l
find tests -name "test_*.py" | wc -l
```

### Step 8: Code Quality Analysis
```bash
# Count docstrings
grep -r '"""' src/navam_invest/ | wc -l
grep -r "'''" src/navam_invest/ | wc -l

# Count type hints
grep -r ": str\|: int\|: float\|: bool\|: List\|: Dict\|: Optional\|-> " src/navam_invest/ | wc -l

# Count functions
grep -r "^def \|^async def " src/navam_invest/ | wc -l

# Error handling patterns
grep -r "try:" src/navam_invest/ | wc -l
grep -r "except " src/navam_invest/ | wc -l
grep -r "raise " src/navam_invest/ | wc -l

# Import statements
grep -r "^from \|^import " src/navam_invest/ | wc -l
```

### Step 9: LLM Integration Analysis
```bash
# Check LLM provider usage
grep -r "ChatAnthropic\|ChatOpenAI\|ChatGoogleGenerativeAI" src/navam_invest/ | wc -l

# Count prompt templates
find src/navam_invest/agents -name "*.py" -exec grep -l "system_prompt\|SYSTEM_PROMPT" {} \; | wc -l

# Token management
grep -r "token\|Token\|max_tokens" src/navam_invest/ | wc -l

# Streaming implementation
grep -r "astream\|stream\|StreamingResponse" src/navam_invest/ | wc -l

# Cost tracking
grep -r "cost\|usage\|tokens_used" src/navam_invest/ | wc -l
```

### Step 10: Feature Completeness Analysis
```bash
# Workflow implementations
ls -1 src/navam_invest/workflows/*.py | wc -l

# CLI commands
grep -c "@click.command\|@typer.command" src/navam_invest/cli.py

# TUI components
find src/navam_invest/tui -name "*.py" | wc -l
grep -c "class.*App\|class.*Widget" src/navam_invest/tui/*.py

# Database/storage
grep -r "sqlite\|SQLite\|database" src/navam_invest/ | wc -l
grep -r "cache\|Cache" src/navam_invest/ | wc -l
```

### Step 11: Dependency Health Check
```bash
# Check for outdated packages (requires pip-audit or similar)
pip list --outdated 2>/dev/null | grep "navam\|anthropic\|langchain\|textual" || echo "No outdated core packages"

# Security vulnerabilities (requires pip-audit)
pip-audit 2>/dev/null || echo "Install pip-audit: pip install pip-audit"

# Check dependency versions
grep "anthropic" pyproject.toml
grep "langchain" pyproject.toml
grep "textual" pyproject.toml
```

## Report Generation

Create a comprehensive markdown report at `metrics/report-{timestamp}.md` with the following structure:

```markdown
# navam-invest - Python Package - Code Metrics Report

**Generated:** {timestamp}
**Version:** {pyproject.toml version}
**Branch:** {git branch}
**Commit:** {git commit hash}
**Python:** 3.9-3.12 compatible

## Executive Summary

- **Total Lines of Code:** {number}
- **Python Files:** {number}
- **Investment Agents:** {count} specialized agents
- **API Tools:** {count} financial data integrations
- **Test Coverage:** {percentage}%
- **Type Hint Coverage:** {percentage}%
- **LLM Providers:** Anthropic (primary), OpenAI, Gemini, DeepSeek, Ollama

## 1. Code Volume Metrics

### Lines of Code by Language
| Language   | Files | Blank | Comment | Code  | Total  |
|------------|-------|-------|---------|-------|--------|
| Python     | ...   | ...   | ...     | ...   | ...    |
| Markdown   | ...   | ...   | ...     | ...   | ...    |
| TOML       | ...   | ...   | ...     | ...   | ...    |
| JSON       | ...   | ...   | ...     | ...   | ...    |
| YAML       | ...   | ...   | ...     | ...   | ...    |

### Lines of Code by Module
| Module               | Files | Lines | Percentage |
|----------------------|-------|-------|------------|
| Agents               | ...   | ...   | ...%       |
| API Tools            | ...   | ...   | ...%       |
| Workflows            | ...   | ...   | ...%       |
| TUI/CLI              | ...   | ...   | ...%       |
| Cache                | ...   | ...   | ...%       |
| Config               | ...   | ...   | ...%       |
| Utils                | ...   | ...   | ...%       |
| Tests                | ...   | ...   | ...%       |
| Documentation        | ...   | ...   | ...%       |

### Agent Breakdown
| Agent              | Lines | Purpose                                    |
|--------------------|-------|--------------------------------------------|
| quill.py           | ...   | Fundamental equity analysis                |
| earnings_whisperer.py | ... | Earnings report analysis                   |
| screen_forge.py    | ...   | Stock screening and idea generation        |
| macro_lens.py      | ...   | Macroeconomic analysis and sector rotation |
| news_sentry.py     | ...   | Market news monitoring and filtering       |
| risk_shield.py     | ...   | Portfolio risk assessment                  |
| tax_scout.py       | ...   | Tax-loss harvesting optimization           |
| hedge_smith.py     | ...   | Options hedging strategies                 |
| portfolio.py       | ...   | Portfolio management                       |
| research.py        | ...   | General research agent                     |
| router.py          | ...   | Agent selection and orchestration          |

### API Tool Breakdown
| Tool                | Lines | Provider                | Purpose                |
|---------------------|-------|-------------------------|------------------------|
| alpha_vantage.py    | ...   | Alpha Vantage           | Stock prices, technicals |
| fred.py             | ...   | Federal Reserve         | Economic indicators    |
| sec_edgar.py        | ...   | SEC EDGAR               | Company filings        |
| fmp.py              | ...   | Financial Modeling Prep | Financial statements   |
| finnhub.py          | ...   | Finnhub                 | Market data            |
| tiingo.py           | ...   | Tiingo                  | Price data             |
| newsapi.py          | ...   | NewsAPI                 | News aggregation       |
| yahoo_finance.py    | ...   | Yahoo Finance           | Market data            |
| treasury.py         | ...   | US Treasury             | Bond rates             |

## 2. File and Module Metrics

- **Total Python Files:** {number}
- **Average File Size:** {number} lines
- **Median File Size:** {number} lines
- **Package Size:** {size} MB (wheel + sdist)

### Largest Files (Top 10)
| File | Lines | Type | Purpose |
|------|-------|------|---------|
| ...  | ...   | ...  | ...     |

### File Distribution by Type
| Extension | Count | Percentage |
|-----------|-------|------------|
| .py       | ...   | ...%       |
| .md       | ...   | ...%       |
| .toml     | ...   | ...%       |
| .json     | ...   | ...%       |
| .yaml     | ...   | ...%       |

## 3. Agent Architecture

### Agent Implementations
| Agent | System Prompt Length | Tools Used | LOC | Test Coverage |
|-------|---------------------|------------|-----|---------------|
| Quill | ... chars | ... tools | ... | ✅/{count} tests |
| Earnings Whisperer | ... | ... | ... | ✅/{count} tests |
| Screen Forge | ... | ... | ... | ✅/{count} tests |
| Macro Lens | ... | ... | ... | ✅/{count} tests |
| News Sentry | ... | ... | ... | ✅/{count} tests |
| Risk Shield | ... | ... | ... | ✅/{count} tests |
| Tax Scout | ... | ... | ... | ✅/{count} tests |
| Hedge Smith | ... | ... | ... | ✅/{count} tests |
| Portfolio | ... | ... | ... | ✅/{count} tests |
| Research | ... | ... | ... | ✅/{count} tests |

### Agent Architecture Metrics
- **Total Agent Lines:** {sum of all agent files}
- **Average Agent Size:** {average lines per agent}
- **Router Complexity:** {lines in router.py}
- **Agent Selection Logic:** {count of routing rules}
- **Tool Binding Patterns:** {consistency analysis}

### Multi-Agent Workflows
| Workflow | Agents Involved | Purpose | LOC |
|----------|-----------------|---------|-----|
| /analyze | Quill + others | Comprehensive stock analysis | ... |
| Tax optimization | Tax Scout + Portfolio | Tax-loss harvesting | ... |
| Risk assessment | Risk Shield + Portfolio | Portfolio risk analysis | ... |

## 4. API Integration Architecture

### API Tool Implementations
| Provider | Endpoints | LOC | Caching | Rate Limits | Retry Logic |
|----------|-----------|-----|---------|-------------|-------------|
| Alpha Vantage | ... | ... | ✅ | ✅ | ✅ |
| FRED | ... | ... | ✅ | ✅ | ✅ |
| SEC EDGAR | ... | ... | ✅ | ✅ | ✅ |
| FMP | ... | ... | ✅ | ✅ | ✅ |
| Finnhub | ... | ... | ✅ | ✅ | ✅ |
| Tiingo | ... | ... | ✅ | ✅ | ✅ |
| NewsAPI | ... | ... | ✅ | ✅ | ✅ |
| Yahoo Finance | ... | ... | ✅ | ✅ | ✅ |
| Treasury | ... | ... | ✅ | ✅ | ✅ |

### API Architecture Metrics
- **Total Tool Lines:** {sum of all tool files}
- **Average Tool Size:** {average lines per tool}
- **API Endpoints:** {total count}
- **Cache Hit Rate:** {percentage}% (if measurable)
- **Error Handler Coverage:** {percentage}%

### Caching Strategy
- **Cache Implementation:** {cache manager LOC}
- **Cache Types:** SQLite, in-memory
- **Common Queries:** {count in common_queries.py}
- **TTL Strategy:** {description}

## 5. LLM Integration Architecture

### LLM Provider Support
| Provider | Primary | Streaming | Token Counting | Cost Tracking |
|----------|---------|-----------|----------------|---------------|
| Anthropic Claude | ✅ | ✅ | ✅ | ✅ |
| OpenAI | ✅ | ✅ | ✅ | ✅ |
| Google Gemini | ✅ | ✅ | ✅ | ✅ |
| DeepSeek | ✅ | ✅ | ✅ | ✅ |
| Ollama (Local) | ✅ | ✅ | ✅ | N/A |

### Prompt Engineering Metrics
- **System Prompts:** {count} agent prompts
- **Average Prompt Length:** {chars}
- **Few-shot Examples:** {count if any}
- **Prompt Templates:** {count}

### Token Management
- **Token Counting Implementation:** {LOC}
- **Context Window Optimization:** {strategies used}
- **Token Usage Tracking:** {implementation status}

## 6. Test Coverage Metrics

- **Test Files:** {number}
- **Test Functions:** {number}
- **Test Lines:** {number}
- **Test-to-Code Ratio:** {ratio}:1
- **Coverage Percentage:** {percentage}% (if pytest-cov available)

### Test Distribution
| Test Category | Files | Tests | Purpose |
|---------------|-------|-------|---------|
| Agent Tests | ... | ... | Agent functionality |
| Tool Tests | ... | ... | API integration |
| Workflow Tests | ... | ... | Multi-agent workflows |
| TUI Tests | ... | ... | User interface |
| Integration Tests | ... | ... | End-to-end scenarios |

### Agent Test Coverage
| Agent | Unit Tests | Integration Tests | Status |
|-------|------------|-------------------|--------|
| Quill | ... | ... | ✅/❌ |
| Earnings Whisperer | ... | ... | ✅/❌ |
| Screen Forge | ... | ... | ✅/❌ |
| Macro Lens | ... | ... | ✅/❌ |
| News Sentry | ... | ... | ✅/❌ |
| Risk Shield | ... | ... | ✅/❌ |
| Tax Scout | ... | ... | ✅/❌ |
| Hedge Smith | ... | ... | ✅/❌ |
| Portfolio | ... | ... | ✅/❌ |
| Research | ... | ... | ✅/❌ |

### Tool Test Coverage
| Tool | Unit Tests | API Mocking | Status |
|------|------------|-------------|--------|
| Alpha Vantage | ... | ✅/❌ | ✅/❌ |
| FRED | ... | ✅/❌ | ✅/❌ |
| SEC EDGAR | ... | ✅/❌ | ✅/❌ |
| FMP | ... | ✅/❌ | ✅/❌ |
| Finnhub | ... | ✅/❌ | ✅/❌ |
| Tiingo | ... | ✅/❌ | ✅/❌ |
| NewsAPI | ... | ✅/❌ | ✅/❌ |
| Yahoo Finance | ... | ✅/❌ | ✅/❌ |
| Treasury | ... | ✅/❌ | ✅/❌ |

### Coverage Gaps
{List of untested modules or features}

## 7. Code Quality Metrics

- **Total Docstrings:** {number}
- **Docstring Coverage:** {percentage}%
- **Type Hint Coverage:** {percentage}%
- **Function Count:** {number}
- **Average Function Length:** {number} lines
- **Error Handling Blocks:** {count} try-except blocks

### Code Complexity
- **Total Functions:** {number}
- **Average Function Length:** {number} lines
- **Longest Function:** {number} lines in {file}
- **Class Count:** {number}
- **Average Class Length:** {number} lines

### Error Handling
- **Try-Except Blocks:** {count}
- **Raise Statements:** {count}
- **Custom Exceptions:** {count}
- **Error Logging:** {count} logger calls

### Code Style Compliance
- **Black Formatting:** {status}
- **Ruff Linting:** {status}
- **MyPy Type Checking:** {status}
- **Disallow Untyped Defs:** {status}

## 8. Feature Completeness Metrics

### Investment Analysis Features
- **Fundamental Analysis:** ✅ Quill agent
- **Earnings Analysis:** ✅ Earnings Whisperer
- **Stock Screening:** ✅ Screen Forge
- **Macro Analysis:** ✅ Macro Lens
- **News Monitoring:** ✅ News Sentry
- **Risk Assessment:** ✅ Risk Shield
- **Tax Optimization:** ✅ Tax Scout
- **Options Hedging:** ✅ Hedge Smith

### Portfolio Management
- **Holdings Tracking:** ✅ Portfolio agent
- **Allocation Analysis:** {status}
- **Rebalancing:** {status}
- **Performance Tracking:** {status}

### Data Integration
- **Market Data:** ✅ Alpha Vantage, Yahoo Finance, Tiingo, Finnhub
- **Economic Data:** ✅ FRED, US Treasury
- **Company Filings:** ✅ SEC EDGAR
- **Financial Statements:** ✅ FMP
- **News Data:** ✅ NewsAPI

### User Interface
- **TUI (Textual):** ✅ Interactive chat interface
- **CLI (Typer):** ✅ Command-line interface
- **Streaming Responses:** ✅ Real-time LLM output
- **Session Persistence:** {status}
- **Slash Commands:** ✅ /analyze, /research, etc.

### Multi-Agent Workflows
- **Agent Collaboration:** ✅ Router orchestration
- **Task Delegation:** ✅ Specialized agents
- **Result Aggregation:** {status}
- **Workflow Persistence:** {status}

## 9. Dependency Analysis

### Core Dependencies
- **anthropic:** {version} - Claude AI integration
- **langchain-core:** {version} - LLM abstraction
- **langchain-anthropic:** {version} - Anthropic provider
- **langgraph:** {version} - Agent orchestration
- **textual:** {version} - TUI framework
- **typer:** {version} - CLI framework

### Financial Data Dependencies
- **pandas:** {version} - Data analysis
- **numpy:** {version} - Numerical computing
- **requests:** {version} - HTTP client

### Development Dependencies
- **pytest:** {version} - Testing framework
- **pytest-cov:** {version} - Coverage reporting
- **black:** {version} - Code formatting
- **ruff:** {version} - Linting
- **mypy:** {version} - Type checking

### Dependency Health
- **Outdated Packages:** {number}
- **Security Vulnerabilities:** {number}
- **License Compatibility:** {analysis}

## 10. Package Quality Metrics

### PyPI Package Metadata
- **Package Name:** navam-invest
- **Version:** {version from pyproject.toml}
- **License:** {license}
- **Python Requires:** >=3.9, <3.13
- **Entry Points:** {count CLI commands}
- **Keywords:** {list from pyproject.toml}
- **Classifiers:** {count}

### Distribution Quality
- **Wheel Size:** {size} MB
- **Sdist Size:** {size} MB
- **Installation Size:** {estimated size}
- **Included Files:** {count}
- **Excluded Files:** {patterns in .gitignore}

### Documentation Quality
- **README.md:** {lines} - User guide
- **CLAUDE.md:** {lines} - Development guide
- **docs/:** {count} files - Comprehensive docs
- **FAQ.md:** {count} Q&A
- **Docstrings:** {percentage}% coverage

## 11. TUI/CLI Architecture

### TUI Implementation (Textual)
- **App Class:** {LOC}
- **Widgets:** {count}
- **Screens:** {count}
- **Event Handlers:** {count}
- **Streaming Integration:** ✅ Real-time LLM responses

### CLI Implementation (Typer)
- **Commands:** {count}
- **Options:** {count}
- **Help Text Quality:** {analysis}

### User Experience Features
- **Chat Interface:** ✅ Conversational AI
- **Slash Commands:** ✅ Quick actions
- **Real-time Streaming:** ✅ Token-by-token display
- **Error Messages:** {user-friendly status}
- **Progress Indicators:** {status}

## 12. Historical Trends

{If previous reports exist, show trends}

### Growth Metrics
- **LOC Growth:** +{number} lines since last report
- **Feature Additions:** +{count} features
- **Test Coverage Change:** +/-{percentage}%
- **Agent Additions:** +{count} agents
- **Tool Additions:** +{count} tools

## 13. Recommendations

Based on the analysis:

### Code Quality
- [ ] Increase test coverage to 80%+ (currently {current}%)
- [ ] Add type hints to all functions (currently {current}%)
- [ ] Add docstrings to public APIs (currently {current}%)
- [ ] Refactor files over 500 lines (if any)
- [ ] Run Black formatter on all files
- [ ] Fix all MyPy type errors

### Agent Architecture
- [ ] Standardize agent interface patterns
- [ ] Extract common agent utilities
- [ ] Add more integration tests for multi-agent workflows
- [ ] Implement agent performance benchmarks
- [ ] Add agent-specific error types

### API Integration
- [ ] Implement comprehensive API mocking for tests
- [ ] Add rate limit monitoring and alerts
- [ ] Improve cache hit rate metrics
- [ ] Add fallback providers for critical data
- [ ] Document all API endpoints

### Testing
- [ ] Add E2E tests for complete user workflows
- [ ] Increase agent test coverage to 100%
- [ ] Add tool integration tests with live APIs
- [ ] Test offline/error scenarios
- [ ] Add performance regression tests

### Documentation
- [ ] Add API documentation for all agents
- [ ] Document multi-agent workflow patterns
- [ ] Create architecture diagrams
- [ ] Add inline code examples
- [ ] Update FAQ with new features

### Performance
- [ ] Profile agent execution times
- [ ] Optimize LLM token usage
- [ ] Implement more aggressive caching
- [ ] Monitor memory usage in long sessions
- [ ] Add lazy loading for heavy operations

### Features
- [ ] Complete remaining roadmap items (backlog/active.md)
- [ ] Add more financial data providers
- [ ] Implement portfolio backtesting
- [ ] Add data export functionality
- [ ] Enhance TUI with more widgets

## 14. Appendices

### A. Detailed File Listing
{Full file tree with line counts}

### B. Agent Comparison Matrix
{Detailed comparison of agent implementations}

### C. API Tool Reference
{Complete list of APIs and endpoints}

### D. Test Coverage Report
{Detailed test coverage by module}

### E. Dependency Tree
{Full dependency graph}

---

**Report Hash:** {sha256 of report content}
**Analysis Duration:** {seconds}s
**Generated By:** Claude Code Metrics Analyzer v1.0 (navam-invest)
```

## Execution Instructions

1. **Install Required Tools:**
   ```bash
   # Install cloc for line counting
   brew install cloc  # macOS
   # OR
   sudo apt-get install cloc  # Linux

   # Install tree for directory visualization
   brew install tree  # macOS
   # OR
   sudo apt-get install tree  # Linux

   # Optional: pip-audit for security checks
   pip install pip-audit
   ```

2. **Run Analysis:**
   ```bash
   # Ensure you're in the project root directory
   cd /path/to/navam-invest

   # Execute all bash commands from Step 2-11
   # Collect metrics into /tmp/ directory
   # Parse outputs
   # Calculate derived metrics
   ```

3. **Generate Report:**
   - Create timestamp: `date +%Y-%m-%d-%H%M%S`
   - Create report: `metrics/report-{timestamp}.md`
   - Update latest symlink: `ln -sf report-{timestamp}.md metrics/latest.md`

4. **Validate Results:**
   - Verify all sections completed
   - Check accuracy of counts
   - Validate agent and tool metrics
   - Confirm test coverage stats
   - Review recommendations

5. **Archive and Version:**
   - Commit metrics report to git
   - Tag with version number
   - Update documentation with findings
   - Share summary in release notes

## Success Criteria

The report should include:
- ✅ All 14 sections completed
- ✅ Accurate line counts and file statistics
- ✅ Complete agent architecture analysis
- ✅ API tool integration metrics
- ✅ Test coverage breakdown
- ✅ Feature completeness assessment
- ✅ Dependency analysis
- ✅ Actionable recommendations
- ✅ Professional formatting
- ✅ Timestamp and metadata

## Key Metrics to Watch

**IMPORTANT:** Think harder about the metrics that matter most for the navam-invest package:

### Agent Architecture Quality
- **Agent Independence:** Minimal cross-agent dependencies
- **Tool Integration:** Clean agent-tool binding patterns
- **Router Efficiency:** Fast agent selection with minimal overhead
- **System Prompt Quality:** Clear, focused prompts under 2000 chars
- **Test Coverage:** Each agent must have dedicated test suite

### API Integration Health
- **Rate Limit Handling:** Graceful degradation, exponential backoff
- **Cache Efficiency:** High cache hit rates (target >70%)
- **Error Recovery:** Comprehensive retry logic with fallbacks
- **API Key Management:** Secure storage, validation
- **Cost Control:** Token usage monitoring, optimization

### LLM Integration Efficiency
- **Token Usage:** Optimize context, minimize waste
- **Streaming Performance:** Low latency, smooth UX
- **Cost Tracking:** Monitor API usage per agent
- **Provider Flexibility:** Easy switching between providers
- **Error Handling:** Graceful LLM failure recovery

### Code Health Indicators
- **Type Hint Coverage:** 100% target for public APIs
- **Docstring Coverage:** 100% for agents and tools
- **Test-to-Code Ratio:** Target 1:2 or better
- **Error Handling:** Try-except in all API calls
- **Code Style:** Black/Ruff/MyPy compliance

### Package Quality
- **PyPI Compliance:** Complete metadata, correct classifiers
- **Installation UX:** Fast install, minimal dependencies
- **CLI Usability:** Intuitive commands, helpful errors
- **TUI Performance:** Responsive, no blocking operations
- **Documentation:** Comprehensive README, FAQ, guides

### Financial Data Quality
- **Data Freshness:** Real-time when needed, cached when appropriate
- **Data Accuracy:** Validation, sanity checks
- **Provider Diversity:** Multiple sources for critical data
- **Coverage:** All major asset classes, markets, indicators
- **Reliability:** Fallback providers, error handling

### User Experience
- **Response Time:** Agent queries complete within 10s
- **Streaming Quality:** Smooth token-by-token display
- **Error Messages:** User-friendly, actionable guidance
- **Multi-Agent Coordination:** Seamless handoffs, clear status
- **Session Persistence:** Reliable state management

### Performance Indicators
- **Startup Time:** CLI/TUI launch < 2s
- **Memory Footprint:** < 100MB typical usage
- **Cache Performance:** 70%+ hit rate for common queries
- **Token Efficiency:** Optimize context windows
- **Concurrent Requests:** Support multiple API calls

### Security & Privacy
- **API Key Storage:** Secure, never in code/logs
- **Data Privacy:** User data stays local
- **Dependency Security:** No known vulnerabilities
- **Code Injection Prevention:** Input sanitization
- **Audit Trail:** Log critical operations

Run this analysis monthly or after major feature additions to track project health and guide development priorities.
