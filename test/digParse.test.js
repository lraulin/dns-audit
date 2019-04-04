const expect = require("chai").expect;
const {
  digAnswerSection,
  parseDigForRecordValues,
  digWhenLine,
  digAnswerLine,
  filterAnswers,
} = require("../src/digParse");

describe("#digAnswerSection", function() {
  context("with empty string argument", function() {
    it("should return empty string", function() {
      expect(digAnswerSection("")).to.equal("");
    });
  });

  context("with valid dig output", function() {
    it("should return all text between newline after ';; ANSWER SECTION:' and newline before next empty line", function() {
      expect(
        digAnswerSection(`; <<>> DiG 9.10.6 <<>> google.com
;; ANSWER SECTION:
google.com.		290	IN	A	172.217.7.238
google.com.		290	IN	A	172.217.7.238
google.com.		290	IN	A	172.217.7.238

;; Query time: 2 msec
;; MSG SIZE  rcvd: 55`),
      ).to.equal(
        "google.com.		290	IN	A	172.217.7.238\ngoogle.com.		290	IN	A	172.217.7.238\ngoogle.com.		290	IN	A	172.217.7.238",
      );
    });
  });
});

describe("#parseDigForRecordValues", function() {
  context("with dig output and array of types (strings)", function() {
    it("should return an object with a key for each type containing a sorted array of values", function() {
      const input = `; <<>> DiG 9.10.6 <<>> google.com
;; ANSWER SECTION:
google.com.		290	IN	A	cat
google.com.		290	IN	A	apple
google.com.		290	IN	A	dog
google.com.		290	IN	B	dog
google.com.		290	IN	B	fish
google.com.		290	IN	C	eggs

;; Query time: 2 msec`;
      const result = parseDigForRecordValues({
        digOutput: input,
        types: ["A", "B"],
      });
      expect(result).to.have.keys(["A", "B"]);
      expect(result.A).to.have.ordered.members(["apple", "cat", "dog"]);
      expect(result.B).to.have.ordered.members(["dog", "fish"]);
    });
  });
});

describe("#digWhenLine", function() {
  context("with string containing ';; WHEN: '", function() {
    it("should return line containing ';; WHEN: '", function() {
      const input = `oauest
;; WHEN: oaestuhnst
snotheu
nsthuaoe`;
      expect(digWhenLine(input)).to.equal(";; WHEN: oaestuhnst");
    });
  });

  context("without string containing ';; WHEN: '", function() {
    it("should return null", function() {
      const input = `oauest
;;WEN: oaestuhnst
snotheu
nsthuaoe`;
      expect(digWhenLine(input)).to.equal(null);
    });
  });
});

describe("#digAnswerLine", function() {
  context("with text containing linebreaks and second argument", function() {
    it("should return line containing second argument", function() {
      const input = `uoeauaoeu
      sthstoaeuCATeatuhsth
      eosatuhsth
      snthstouoea`;
      expect(digAnswerLine({ answerSection: input, value: "CAT" })).to.equal(
        "      sthstoaeuCATeatuhsth",
      );
    });
  });

  context("with text that does not contain second argument", function() {
    it("should return line containing second argument", function() {
      const input = `uoeauaoeu
      sthstoaeuFISHeatuhsth
      eosatuhsth
      snthstouoea`;
      expect(digAnswerLine({ answerSection: input, value: "CAT" })).to.equal(
        undefined,
      );
    });
  });
});

describe("#filterAnswers", function() {
  context(
    "with text containing line breaks and spaces and an array of strings",
    function() {
      it("should return text with only lines where 4th word in in supplied array", function() {
        const input = `cat fish dog man woman
it is very quick fox jumps
every good boy does fine
what a fine mess`;
        const expected = `cat fish dog man woman
every good boy does fine`;
        const answer = filterAnswers({
          answerSection: input,
          typesToKeep: ["man", "does"],
        });
        expect(answer).to.equal(expected);
      });
    },
  );
});
