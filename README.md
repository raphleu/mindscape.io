# mindscape.io

the premier web outliner

an app for writing/reading notes, where you link up your notes arrows to form webs, so you can collapse the neighborhood of a note into an outline under that note. So you can have different outlinings of the same stuff. 

check out the live beta @ www.mindscape.io

### the Motivation
*It's hard to organize my notes so that I can keep track of everything as an integrated, curated whole.
  *I rarely come back to old notes bc they're essentially all in a couple big piles, so it's not worth the effort to look through.
  *I have separate piles for email, text messaging, fb messaging, fb posts, my academic writing, etc
    *Within each pile, I have a little bit of organization, maybe notebooks or folders--but I can only view one folder at a time-- it's hard to tune what's in the display.
*I want to organize my notes according to multiple schemas and switch quickly between them.
  *I want to organize my notes in a hierarchy from most generic to most specific
    *I want the hierarchy to be such that a note can fall under multiple super-notes at a time
    *I want everyone's notes to be organized in a similar hierarchy, so we can compare corresponding areas
  *I want to organize my notes according to the time of writing, like in a stream or journal.
    *I want be able to set notes into future/past parts of the stream, like in a calendar.
    *I want to look at the transformation of my notes over time, while they are displayed in a consistent manner.
  *I want to organize everyone's notes according to the location they were taken
    *I want everyone to be able to post notes this way, so I can get the local news and reach out to people nearby or in a specific place, like craigslist or tinder
  *I want to organize my notes by who I've shared them with
    *I want to organize my friends by what notes I've shared with them
  *Different encodings/formats/ of the same data lend themselves better to different use cases
    *e.g. SI units vs American units
    *e.g. polar coordinates vs cartesian coordinates
    *e.g. speaking vs writing
    *e.g. printing vs writing
    *e.g. electronic text vs analog text
    *e.g. outlines vs essays
    *e.g. a diagam, chart, graph, table, scatterplot, flowchart vs wrapping text
    *e.g. english with mathematical notation vs pure english
    *e.g. javascript vs c vs haskell vs whatever
*Consciousness, language, and notation are super interesting
  *Formations of matter/motion/energy propagate into me and through my internal media. Some of the information is lost/destroyed/dissipated by collision/friction with the fixed structures of my cognition, while other informations passes through the right holes, enter the right cycles, and are perpetuated internally, somtimes finding their way into my cosnsciousness, my expressions, and perhaps into other people.
    *e.g. channeling energy into people at a party via the right music selection
    *e.g. I can only see some part of the EM spectrum, only a certain size of thing, only things in the right language for my receptors/mind
  *The filtration/mapping/reducing of experience into language seems to be an extension of the same processing of reality into experience. The mysteries of experience/consciousness may be approached by beginning with these simplified expressions. 
  *It would be cool if we all produced mental maps (say as part of the school curriculum), for internal reflection, and for study in aggregate.
*Organizing the Internet is key to promoting education and democracy.
  *It would be like humanity gaining a nervous system, as opposed to things just happening by diffusion/osmosis
    *Right now things are organized enough that we can use money as model for willpower and information, but I think things are messy to the point that money holds too much weight in politics
  *Social media has been around since the first gesture was given and received, and the first word spoken, written, printed, telegraphed, broadcasted, etc. Internet is less about the wires and computers, and more about the infrastructure of information/energy storage and transfer


### the Plan
1. Write notes (e.g. thoughts, messages, pictures, posts, letters, etc)
  1. Committed notes are private by default
  2. Committed notes cannot be modified, but you can delete them if you like.
    1. This seems odd at first, but it's no different from standard text messaging. (Private notes are just messages to your self!)
    2. To modify a note, create a new note that links from the existing note. (We'll make cloning notes easy.)
    3. This way, you can build up a history of versions, in case one day you'd like to trace the evolution of key notes.
    4. This way, note contents are immutable state-- you (and the public?) now have reliably consistent units of information. If a note isn't constantly changing, you can link to it without worry that the meaning of the link will change. You get stable building blocks to move around.
    5. This way, your cognition operates on your notes with greater functional purity! Pure functions take input and produce output without changing the input or producing "side effects"-- this should make it easier to understand the nature of the function from observing just the input and output notes
    6. This encourages the usage of modular notes-- maybe about the size of a single point, or a single rant-- you can break a really long note into modules later if you want to
    7. You can still edit a note while you're writing it, but committing is cool and improvisational and freeing


2. Link notes together with arrows (the technical/math term for such a web is a "directed graph")
  1. I'd like links to connect (factor)->(product). Similarly: (part)->(whole), (component)->(composite), (generic)->(specific), (prior)->(posterior), (input)->(output)
  2. Directed graphs are awesomely essential.
    1. They model the Internet we currently love and use and experience and are-- "documents" linked together using references/pointers/addresses. We browse the web by following links from page to page. The Internet is one big directed graph.
    2. They model the academic citation of papers, the import statements of software modules. Directed graphs are the basic feature of finite state machines, markov chains, neural networks, mathematical Categories, and other useful structures
    3. A tree is just a type of graph. Trees are super cool too.
      1. They model the directory-tree structure on each of our computers. You can imagine each folder as a node with an arrow to each of its children, where files are leaf-nodes. A tree is just a type of graph. The Internet is a web of such trees, i.e. one big web.
      2. They model the taxonomic tree (ontological or biological or whatever). Such trees go from most general category to most specific category. Note that each category is defined by the presence of generic features possessed by all members of that category. I'd like these features to be represented as factor notes, with the members as product notes-- the category is a note itself, a mental model-- another product of these features.
      3. They model reasoning from first principles, a key principle of physics. (aka foundationalism, constructivism, derivation from axioms, etc). It's a great hobby.
    4. Directed graphs seem a necessary model, given (1) if we experience via "things", i.e. discrete/finite/[possessing scope/bounds] being, i.e. particles and waves; then we have nodes (2) if every thing is everything, an interconnected/integrated Universe of things we can't absolutely separate; then we have a graph (3) if we experience flow/directionality of time, then we have to build movement/flow/directionality into the graph (by mapping edges to arrows and objects to sequences 
  3. Creating a note, we will automatically link some factors for you: The current time node (a leaf node in the public time-tree, e.g. ...->(2017)->(Feb 11)), the current space node (a leaf node in the public space-tree, e.g. ...->(USA)->(Los Angeles, CA)), and the current super-note (i.e. folder) in which you're writing
    1 Use the public space time notes to initiate sharing/ social media-- from there, you can also begin to browse via traversing notes you've link with
    2. To reply to a post (perhaps your own previous opinion on something), set that note as the super note when you begin writing, and it will be automatically linked. Similarly, reply to a group chat factor-note (links/notes are automatically ordered)
  4. Link in from other notes you'd like to cite/import/reference (respond to multiple notes at once!).
  5. Link out to other notes that take this note as a premise
  6. Link bidrectionally for notes that are equivalent/isomorphic/form an "if and only if" relation! (e.g. map core beliefs/premises across the population)
  7. Links to a note written by the author of that note are highlighted 
  8. Links written by yourself are highlighted in your view


3. Move notes around in the plane.
  1. People are better at memorizing paths through space than lists of symbols, so if you build your tree such that things are consistently placed, ideally you'd have a better sense of where each individual thing sits in relation to the whole
  2. Drop a note into other note to make an outline (a compact visualization of an ordered tree)-- outlines are easier to read than strings of text because the supernote-subnote relationships between blocks is built into the notation spatially so that it is immediately recognizable. Outlines are so much cooler than lists bc they use the 2 dimensions differently (1 for flow, 1 for generic->specific); normal essays use both dimensions for flow. (Sup, trello)


4. Manage your web as a web of outlines. Recall that an outline is just a visualization of a tree that's optimized for reading/writing more densely.
  1. Collapse outlines into the parent note to subordinate information you don't need right now (you only have so much working memory/ screen space-- don't want things to get too cluttered) open them up again later when you need them (remember not to lose track of what's in there-- that's like the main problem with my exisiting note taking that i'm trying to tackle-- curation of the notes as a whole)
  2. Notice that your tree's may overlap, as notes may share common factors and common products. That's cool though, because we can store the outline structure meta-data in the links you drew, so you can click a note control to automatically re-outline all the factors or products of a given note, under that note (use controls to apply this recursively to get children of children)
    1. This is the key development that leverages computing power to automate transformations of the outline. This lets you outline the web, so you can have multiple super-notes for a single note, switching between different hierarchies of the same notes. This lets you invert outlines, so that an block in the web can be a super-note, with its relations falling underneath it in the organization


5. Research and develop what's important to you!
  1. Instead of Todo lists, make webs of notes that you can collapse into TODO outline, when you want to view it that way


6. Get social
  1. Share good content
  2. Make small payments and/or subscribe to content generators you like (e.g. the development team). Money is an awesome tool-- it's supposed to represent value. Lets help it be a more accurate model. 
  3. Instead of messaging people at a single address, do a quick traversal of their public ontology to find the closest node to your message, and link it to that node. You can think of each node in the tree as a mailbox. 

7. Get students to curate all their writing in a single place, a model of the evolution of their consciousness
  1 Students can publish some of their notes in the safe places such as to their class and school, where they can draw links to/from the notes of their teachers/peers.
  2. Isomorphisms on specific things/opinions may vary, but we should be able to find them starting from the root factor (Universe, or Experience, or Everyting or God or Being or something like this) into Space, Time, need for air, need for water, conservation of energy, conservation of momentum, basic physical laws, the ineffability of things, the American Revolution, Descartes' meditations, etc
  3. Each student should create their own Bill of Rights (beginning with physical law and extending into politics). Perhaps it will begin as a copyof the American bill of rights, plus some values inherited from parents, peers, teachers; then it will evolve over time.
    1. Draw isomorphisms between items on the bill of writes to establish consensus, and find where the political differences truly lie (beginning from first principles). Then individuals from each group can address the different position altogether, and ideally work towards solution.
    2. Schools should help students assume their duties as citizens of Humanity
  4. Take these mind-maps, these concept-graphs as objects of study. (longitudinal and cross-sectional studies)
    1. Standardized testing is useful because you need to observe something (i.e. the situation in students/teachers/schools) in order to respond to it-- allocate resources effectively and equitably, but it emphasizes multiple choice questions (which are pretty useful in measuring very specific skills/knowledge) and uses essays which provide another sample of the cognition of students (again towards a specific topic, under a specific time constraint)
    2. Students should be able to explore and write about concepts they find interesting on the timescale of their whole life


8. Apply this web-outline model to 3D virtual/augmented reality stuff.

9. Promote education and democracy!

10. Solve the sustainable energy problem.

11. Make sure strong AI works out for us.

12. Get humanity going on multiple planets.

13. ???

14. Profit.

15. Dissolve into everything.
