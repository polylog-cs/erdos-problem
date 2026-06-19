# Shortened


## [00:00:00] Who Was Erdős


## [00:00:00] OpenAI Math Breakthrough

[00:00:00] **VV:** OpenAI managed to use one of their models to disprove what they call a central conjecture in discrete geometry. Specifically, it's the unit distance conjecture posed by Erdős about 80 years ago.

[00:00:09] And most of the coverage of this news doesn't tell you that much more than what I just said in three sentences.

[00:00:14] We wanted to cover this topic and the problem in more depth and also talk about what this news and AI math in general means for the future of mathematics. Or more provocatively, will we have mathematicians in 2030? We had a call about this with Vashek Rozhon, uh, one of the Polylog members that you don't usually see on camera, and for the most part, it will be him talking because he knows a lot about this kind of math, and he knows a lot about AI math,

[00:00:36] so without further ado, here's the-- disproven unit distance conjecture.

[00:00:45] **VR:** So, you know, I, 

[00:00:46] I think that many of our viewers, uh, know the name of, Paul Erdős, right? He was this amazingly prolific mathematician in 20th century. Doing mostly combinatorics and dis- uh, discrete mathematics. He was just , solving problems left and right, right? [00:01:00] And he was making conjectures left and right. 

[00:01:02] he actually sometimes offered money, in the sense that he said like, you " know, Look, if you prove or disprove my conjecture, I will give you some money." Oftentimes it was like maybe like 1K dollars or something like that, literally the hardest way of, uh, earning one K dollars is try to prove or disprove like a conjecture by Erdős because he was amazingly good.


## [00:01:21] (Switching off screen sharing here)

[00:01:21] **VR:** And yeah, go- going back to his problem, it's actually a very famous problem of Erdős.

[00:01:25] The statement is actually incredibly simple. But like once you start thinking about it, it, it's like really hard. 

[00:01:30] It's just put endpoints in a plane to maximize the number of pairs that are the same unit distance apart.

[00:01:37] So this picture that I'm showing, it shows something like ten points in a plane. And I have put an edge between a pair of points if they are distance exactly one apart. So you can imagine that I take a ruler and I kind of look at all of those pairs, all of them are distance one apart.

[00:01:51] The question is very simple: if I give you some number N, you should put N points on a plane so that you maximize the number of such pairs.

[00:01:57] It's really not a question about N equals to ten. It's a question [00:02:00] about, what happens, when N grows to infinity.

[00:02:02] It's a very simple question, but it's very hard to answer. people realize that it goes actually quite deep.


## [00:02:08] Basic construction

[00:02:08] So one construction could be square grid, right? You can say for any N, put root N times root N points in a grid, and that's it. That will generate maybe many unit distance pairs, right?

[00:02:21] In this example, everybody has four buddies, right? North, west, east, and south. So the number of unit distances that you generated is something like two N.

[00:02:29] That's actually not very much, right?

[00:02:30] On the other hand,

[00:02:31] you could hope that maybe there is some kind of absolutely insane construction where there could be as many as N squarish pairs of points So this is what Erdős is asking about. He's asking this asymptotic question.

[00:02:41] So Erdos himself actually tried to answer this question. And he concluded that, you know, probably it's impossible to have a dense point set. He thought like, you know, probably it's impossible for there to be a point set where you would have like n to the one point zero zero zero zero one many [00:03:00] edges.


## [00:03:00] Tady by se hodila animace ^

[00:03:00] And he had two reasons for it.

[00:03:01] So The first one is so-called upper bound. He kind of proved for any point set, there can be at most n^1.5 many edges. So let me explain what this upper bound is and like, you know, why it gives us some intuition.

[00:03:13] Erdos' absolutely amazing and genius idea is to count cherries.


## [00:03:19] Cherry counting

[00:03:19] Okay, so what is a cherry? So a cherry is this configuration.

[00:03:22] You take three points, such that, two of them and two of them are unit distance apart. And he says that, look, on one hand, in any point set, there cannot be too many cherries. So why is that? Well, think about picking any pair of points, okay?

[00:03:38] How many cherries can these two points define? Well, actually just two, right?

[00:03:43] Uh, Which means that the total number of cherries is like relatively small. It is at most something like two times n squared.

[00:03:49] On the other hand, he realized that if there were actually many edges in my configuration, if there were many pairs that are unit distance apart, that would actually mean that there would have to be super [00:04:00] many cherries.

[00:04:00] So why is that? Well, there another way of how we can count the number of cherries. We can just say pick any point and think about it as a center of a cherry. If you have a point and it has like, you know, one hundred edges around it, uh, the guy has like, you know, one hundred buddies of distance one , how many cherries does this guy define?

[00:04:17] Well, it will be something like one hundred squared, right? Because for any pair of buddies, you can kind of connect them in a cherry. Uh, in reality it would be some kind of binomial coefficient. But asymptotically, that binomial coefficient is roughly, the number of your buddies squared.

[00:04:33] So now you can start running algebra autopilot. Sum up, this thing over all of the vertices in a graph. You can use something called Cauchy-Schwarz inequality. And long story short, you will get another bound for number of cherries. And that's great.

[00:04:45] we can kind of put these two bounds together. And again, after some algebra autopilot, we find out that the number of edges has to be at most like n to the one point five.

[00:04:54] Okay, so we were counting cherries, but maybe if we were counting something more complicated, or if we had like more advanced [00:05:00] argument, we could probably push this further, right?

[00:05:02] Maybe we could go from n to the one point five, to n to the one point four, one point three, and so on. ultimately, it's, like, very plausible that if we do some version of this argument on steroids, we would get all the way up to proving that, n to the one point zero zero zero is impossible.

[00:05:17] This is one intuition why kind of Erdős believed that the right answer is probably n-ish.

[00:05:22] He also had a second intuition, that was that he actually tried to come up with some point set that would have n to the one point o-o-o-o-o-o-o-one many edges. He almost got there, but not quite. He failed. And this is why he conjectured that, look, it's probably not possible, right?

[00:05:38] His point set was actually just a grid. Erdős had, like, the following idea. He said,

[00:05:42] Look, maybe instead of looking at distance one, we can look at distance maybe five, right?"

[00:05:46] So let's see how many buddies everybody has at a distance five. So let's pick this central verte-vertex, and let's look at the buddies. And actually, now there are many more of them.

[00:05:54] And why is that? Well, three squared plus four squared equals five squared. So actually, [00:06:00] if you look at a distance five, there are m-many more buddies, of everybody in the grid. that's like this thing that you may've learned in high school, Pythagorean triples.

[00:06:08] I defined the problem as unit distance problem. But actually, you know, if you just scale this whole picture by five, then they will be unit distance apart, right? So we don't have to talk about unit distance. We just have to pick some number, some distance, and then count how many pairs are there of that distance.

[00:06:23] So you are doing better if you are looking at distance five than if you are looking at distance one.

[00:06:28] So let's look at sixty-five, actually. Everybody has just, like, so many buddies, right? It's actually insane. the question is, like, why sixty-five? What's so interesting about sixty-five? And this is what Erdos worked out. A general formula that lets compute the right distances to look at, so that everybody has extremely large number of buddies.

[00:06:48] So here is how you can construct these numbers. I will not prove it because, I would need some kind of number theory for that. You have to look at prime numbers that have remainder one modulo four, okay, for whatever reason. 

[00:06:57] So for example, five divided by four, the [00:07:00] remainder is one, right? And thirteen divided by four, like the remainder is one, and so on.

[00:07:04] And what Erdos worked out is that if you just keep multiplying these prime numbers, then you keep generating the right distances.

[00:07:12] And then he kind of optimized this construction for general n, and he found out that he could create a point set, which would be just like a grid,

[00:07:20] that generates something like n to the one plus one over log log n many edges.

[00:07:24] this Is like some really weird complicated function. But like although this function kind of grows faster than n, it still grows smaller than n to the one point one or n to the one point o-o-o-one, any number larger than one that you put in the exponent, this function grows slower.

[00:07:43] Okay, so Even Erdos failed to construct an example, so, you know, probably there is no example.


## [00:07:47] OpenAI construction

[00:07:47] Now, the big breakthrough by GPT is that it didn't fail. Uh, GPT managed to construct a point set with something like n to the one point zero one edges per endpoint, right?

[00:07:58] This problem, it's still very [00:08:00] far from being solved. But the thing that we now do know is that Erdős was wrong. Whatever the answer is, and it will probably be very hard to find it, we know that it is somewhere between n to the one point zero one and n to the one point three.

[00:08:14] I would like to tell you a little bit more about how the construction by GPT works. It's actually hard. So first of all, it's hard for me. It's kind of a little bit beyond my pay grade, uh, to be honest. And even if it wasn't, it would be actually quite hard to explain it quickly in this video.

[00:08:31] Uh, this is the best picture that I got when I was trying to recreate, uh, the construction, uh, of GPT. The construction is very asymptotic. It kicks in only extremely large values of n, so it's, like, quite hard make it work for small n. It's also kind of underdefined, so it's not like there would be, like, one single picture that would work.

[00:08:50] There are, like, several instantiations of how to make the construction by GPT work.

[00:08:55] So let me just say one thing about it.

[00:08:57] what the GPT is doing is that it basically [00:09:00] follows Erdős' footsteps. GPT kind of takes his general approach, generalizes, and then it uses, like, a bigger hammer than what Erdős was doing.

[00:09:08] Erdős already used some number theory, but it was the kind of stuff that people knew in nineteenth century, let's say. What the GPT is doing is more complicated. It uses some more heavy tools from this area called algebraic number theory, and somehow it makes it work.

[00:09:23] The thing that I would like to comment on this is a more general observation about the nature of the solution. So the solution itself is actually relatively straightforward. So OpenAI's paper has maybe something like twenty pages, but, like, the math in it, like, you could probably compress it into, like, you know, three or four pages.

[00:09:43] So the solution itself is relatively straightforward, but the hard part in my opinion, is kind of to understand algebraic number theory well enough.

[00:09:52] This goes back to what are the main strengths of LLM currently and what are their main weaknesses. the main strengths of LLMs, as [00:10:00] I see it, are, well, memory.

[00:10:02] Like already GPT-3 could speak like, I don't know, thirty, fifty languages. So it had amazing memory, right? And GPT-5, uh, it actually understands pretty much the whole mathematics, like, you know, across all the subdomains.

[00:10:15] So if you have some kind of problem that you can solve by taking what is known, in discrete geometry, the subarea where this problem is com-coming from, and if you can combine it with your knowledge of algebraic number theory,

[00:10:27] human mathematicians, well, there are not so many people around, that would actually both understand discrete geometry very well and that would also understand algebraic number theory deeply enough. But LLMs, they do understand everything very well. Okay? So this is their main strength.

[00:10:44] And on the other hand, like the current weaknesses of LLMs is that we still do not have great ways of how to turn, uh, compute during test time, uh, into results. What I want to say is that, like, if you give me a lot of time, I scale better than LLMs. Uh, the extreme [00:11:00] example of this would be Andrew Wiles, who solved last Fermat's theorem, and he needed like seven years to do that. 

[00:11:06] If you give me half a year and let me work on a problem, I will probably get than if you give half a year to GPT-5. GPT-5 will probably relatively quickly start going in circles. It will not know how to proceed.

[00:11:19] Of course, uh, this will absolutely change in like half a year or a year, ​


## [00:11:26] VR's AI math project


## [00:11:26] Back to call

[00:11:26] **VR:** So I, I can actually start by telling you s- like some results of, like, my experiments, right? That I did, like, with our system. Even with our, like, very limited, setup and, very limited money that we are throwing at it, we are actually able to like, you know, basically produce like a few diploma thesis or like few undergrad thesis per day, right?

[00:11:43] **VV:** Yeah

[00:11:44] **VR:** You know, these are not some kind of spectacular results because we are, we are not having like, you know, the state-of-the-art models. but like, you know, also like most, most of the problems that mathematicians think about are kind of much easier than Erdös problems, right?


## [00:11:56] Waterline of Math Ability

[00:11:56] **VR:** I'm kind of trying, like, thinking about like this, like, sea level, which is, like, [00:12:00] rising, right? This sea level is currently like around like some kind of undergrad thesis or like diploma thesis. Some kind of like legitimate mathematical result. It wouldn't be like the thing that I would base my career on, but I, I wouldn't feel like, you know, I'm proving something too simple or something like that, right?

[00:12:15] And, and this waterline is like, you know, something very different than what is, like, the currently the best produced result. Like this Erdos unit distance problem, this is like, you know, way better than, like, what most mathematicians, including me, like, produced ever during their lifetime.

[00:12:29] And th- this waterline is currently lower, but it already says that, like, you know, being as a good mathematician as this waterline there's already like not much value in being such a good mathematician, right? And I feel that like, you know, in few years, uh, we will start getting obsolete very rapidly.

[00:12:45] I, I still hope that I'm currently better mathematician than waterline, but, like, my point is that th- this waterline will steadily rise, right? Until it will, like, basically like reach, uh, the height of, you know, solving this unit distance conjecture.

[00:12:58] ~~And of course, like what's also good to say is that there, there will be some interim period, for maybe like one year or two years, people will still play a role because people will kind of guide the AI. They will ask better questions, and AI will kind of do the technical work, right? In the same sense as we are using calculators.~~

[00:12:58] ​

[00:13:03] **VV:** There's this quote that I heard, like, "Average mathematicians write proofs, good mathematicians write conjectures, and the best mathematicians write definitions." And so it's harder for me to see that being automated or, like, perhaps the fundamentally, human part of mathematics is, like, deciding what are even the things that we consider interesting in the first place?

[00:13:24] Because are so many mathematical statements that we could prove, and s- only some of them do we consider interesting or elegant.

[00:13:30] **VR:** No, I, I think I completely agree with you in some sense, like asking the right question is just the hardest part of mathematics, right? And so this will be kind of the last, stand of humanity, right?

[00:13:41] Whether you asked or not asked the right question, you will learn only in maybe 10 years of time, right? So it's like extremely difficult problem to evaluate. But I don't see any like, you know, qualitative reason why it shouldn't happen. It will be just like another data point on this exponential.

[00:13:57] **VV:** But then what is the verifiable [00:14:00] reward, right? Like if I'm like Claude Shannon and I'm starting information theory, like what is telling me that I've made the right move and I've made the right definitions and that this is something that's like useful and interesting to think about? 

[00:14:13] **VR:** So, like, 


## [00:14:14] Beauty as Simplicity

[00:14:14] **VR:** you know, typically in mathematics, you will learn it by seeing applications at some point, right? Like, you can be like, Grothendieck, who was proving some kind of incredibly ast- abstract theories. But right now, when people are kind of, like, looking back, they are actually seeing, like relatively concrete applications of it, right?


## [00:14:30] TODO grothendieck image

[00:14:30] **VR:** There are some kind of, like, you know, mechanical aspects of checking whether your big idea was right or not, right? Because if it was right, like typically you see some kind of applications or you can unify, some kind of previously understood fields together. You can maybe answer some question of somebody, or you can get, like, a better intuition about something.

[00:14:52] This is also something you can in the end verify, right? That, like, you got better intuition about some field. or maybe you even get some applications in practice. 

[00:14:59] So [00:15:00] I, I totally agree with you that this is, like, really hard and, like, you know, some kind of, beauty plays also part in this. But again, like, you know, beauty is something that in some sense is a little bit mechanical, right? Because, like,

[00:15:13] **VV:** a, that's a hot take. That's a crazy take.

[00:15:16] **VR:** No, like, you know, uh, l- look Kolmogorov complexity, all right? Like beauty is in simplicity. Like pythagorean theorem 

[00:15:23] **VV:** in, the strictly, like, beautiful mathematical statements, right? 

[00:15:26] **VR:** Yeah, exactly. I'm not talking about, like, beauty of flower. I'm just talking about like, you know, uh, when mathematicians are, like, claiming that theorems are beautiful.

[00:15:34] What I'm saying is that this is not magic. There, there is some kind of like mechanical components to it.

[00:15:39] By the way, first of all, I, I want to say that like, you know, maybe AIs are actually already beating us in this aspect of mathematics right now, most mathematicians, never get famous for, asking a question that started a new field or something like that, right?

[00:15:53] Most mathematicians are much more, much more like, you know, down to earth. Prove the question that your colleague asked five years [00:16:00] ago or something like that, right?

[00:16:02] So we are saying like, "Look, in some distant future, like, you know, in three years, AI will get better than us." But actually maybe it already got better like three months ago. It's hard, hard to say, right?

[00:16:14] ​

[00:16:17] **VV:** Okay, so thanks for watching. This has been our, exploration of, OpenAI's new result. We hope you enjoyed the new format. Let us know. We're sort of always happy to experiment with new things and obviously because this is time sensitive, the format is a bit different.

[00:16:33] less animations, we're talking off the cuff, and it's not a prepared script. Um, let us know what you think about it. Should we do more of this? Should we do... Should we never do this again? Uh, let's see what happens."

[00:16:45] **VR:** Okay, bye

[00:16:46] **VV:** Bye-bye

