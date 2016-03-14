export default class Grammar {
  constructor(rules = [], meta = {}) {
    this.rules = rules;
    this.meta = meta;
  }

  // Define a new rule.
  rule(rule) {
    if (Array.isArray(rule)) {
      rule.forEach(this.rule);
      return rule;
    }

    this.rules.push(rule);
    return rule;
  }

  // Load rules from another grammar (subset grammar)
  use(grammar) {
    this.rules = this.rules.concat(grammar.rules);
  }
}
