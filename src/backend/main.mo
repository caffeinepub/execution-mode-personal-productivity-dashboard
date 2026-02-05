import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

actor {
  type Quote = {
    text : Text;
    author : Text;
  };

  let DEFAULT_QUOTES : [Quote] = [
    {
      text = "Discipline is the bridge between goals and accomplishment.";
      author = "Jim Rohn";
    },
    {
      text = "Success is nothing more than a few simple disciplines, practiced every day.";
      author = "Jim Rohn";
    },
    {
      text = "We must all suffer one of two things: the pain of discipline or the pain of regret.";
      author = "Jim Rohn";
    },
    {
      text = "Consistency is what transforms average into excellence.";
      author = "Tony Robbins";
    },
    {
      text = "Small disciplines repeated with consistency every day lead to great achievements.";
      author = "John C. Maxwell";
    },
  ];

  type ZenQuotesResponse = [{
    q : Text;
    a : Text;
  }];

  public shared ({ caller }) func getRandomQuote() : async Quote {
    let randomIndex = 123 % DEFAULT_QUOTES.size();
    DEFAULT_QUOTES[randomIndex];
  };

  public shared ({ caller }) func getDailyQuote() : async Quote {
    let dayIndex = 20240624 % DEFAULT_QUOTES.size();
    let quote = DEFAULT_QUOTES[dayIndex];
    {
      text = quote.text;
      author = quote.author;
    };
  };

  public query ({ caller }) func getReverseLifeClockStats() : async {
    daysRemaining : Nat;
    daysElapsed : Nat;
    percentUsed : Nat;
    totalDays : Nat;
  } {
    let deadline20260630 = 13882;
    let today = 13382;
    let daysRemaining = deadline20260630 - today;
    let daysElapsed = today - 13382;
    let totalDays = deadline20260630 - 13382;
    let percentUsed = daysElapsed * 100 / totalDays;

    {
      daysRemaining;
      daysElapsed;
      percentUsed;
      totalDays;
    };
  };
};
