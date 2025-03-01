export default async (index, data, acc) => {
    let ans;
    data.questions.forEach((q) => {
        if (index !== data.questions.indexOf(q)) return;
        if (["multiple_select_quiz", "quiz"].includes(q.type)) {
            q.choices.forEach((ch) => {
                if (ch.correct) ans = q.choices.indexOf(ch);
            });
        } else if (q.type === "open_ended") {
            ans = q.choices[0].answer;
        }
    });
    return Math.random() < acc ? ans : Math.floor(Math.random() * 3);
};
