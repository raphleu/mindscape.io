http://mindscape.io
(msio
  (users)
  (client (react) (redux))
  (server (nodejs) (neo4j))
  (model (nestable web) (graph outline)
    (node)
    ((define B A)
      (A <-- B)
      (an arrow between from B to A)
      (B Defines A)
      (A is abstract while B is specific
        (A is general while B is concrete))
      ((A)<-[:DEFINE]-(B)
        (msio (neo4j)))
    )
    ((present A B)
      (A (B))
      (a nesting of B in A)
      (A Presents B)
      (A is container while B is component)
      (A is function while B is parameter)
      (A is frame while B is object)
      (A is object while B is detail)
      ((A)-[:PRESENT]->(B))
    )
  
)
  
Defines are rendered as arrows between Nodes.
Presents are rendered as 

((A (B)) (A (node (connected by (Define path
                       (arbitrary directionality)
                       (between (A) (B))
                     )
       )
     )
  ))
  
 

(A (B)) is similar to (A)<--(B)

The graph is more general than nested containers because 
graph converted to nested containers forms some type of venn diagram type blurry containers
Nested containers converted to a graph forms a directed tree

trees 
  single relationship in one direction
  multiple relationshisp in other direction
graphs are better because each node can have multiple parents/containers/tags
  multiple relationshisp in both directions
  
trees are nice
highlight trees in the graph

display a tree of nodes via nesting (can only have one nesting tree going on)

have a graph in the background to store structure that can be used to redraw trees


A user opens http://mindscape.io
He/she sees a
  logo, navbar/title
  dashboard, info
Ol' Billy Ham Cham registers via the dashboard, automatically creating (author <-- (mandala))
  i.e. he/she creates (author:Node)<-[read:DEFINE]-(mandala:Node), (author)-[write:PRESENT]->(mandala) in neo4j. Then, he sees
  logo, navbar/title
  dashboard, mandala

  (Universe (user (thought (Internet (mindscape.io (author (mandala (node)))))))
            (Internet (mindscape (author (mandala (node))))) in general.
  
generally, 
    
  (author) <-- the user's identity,
  (mandala) <-- everything in his/her experiencing.
  (mandala) contains all (Node) in the webportal
    e.g. (mandala (node1) (node2) (node3 (node3.1) (node.3.2)))
  (author) isn't in rendered in the webportal
  (author) can be attached via OAuth to other authenticators/services.


    
    allowing (a)<--(b) or (a<--(b)) or ((a)<--b) 
  

**Nested lists are ordered trees!

A user posts by creating (node) in some other (node) e.g. (mandala) or (mandala (journal (Mar 25 2017)))


He links related Nodes with arrows,
  i.e. he creates -Define-> relationships,
    taking some (specific/concrete Node)-to Define->(a abstract/general Node).
The directed graph (Nodes_defined, Defines_created)
  must be connected,
  with the author Node as its only sink.
  {Nodes_created} by the user must be a subset of {Nodes_defined} by the user.
The user nests Nodes within other Nodes to group them,
  i.e. he creates -Present-> relationships,
    which are directed from container to component.
  A Node can be nested within a container only if there is a Define path between them,
    and all the intermediate Nodes in this path are already nested within that container.
  The directed graph (Nodes_presented, Presents_created)
    must be a connected tree,
    with the author Node as its only source.
    The intersection of Nodes_presented and Nodes_created by the user
      need only contain his author and world Nodes.
    This Presentation tree is
      the secondary structure of the model and
      the primary structure of the view.
Creating a Node
  automatically creates
    a Define to and
    a Present from
      its container.
Committing a Node makes its content immutable.
The user dismisses a Node from view by
  selecting it and
    deleting the Present_in relationship
      between it and its container Node.
Each Node (e.g. the user's world Node)
  can switch between displaying its component Nodes in either
    a list (that can be sorted along a selected property) or in
    a resizable space (that supports
      arbitrary positioning,
      plotting according to selected properties, and
      automatic repositioning via force simulations).
Nested list formats yield the standard hierarchical outline format.
A Node can be minimized to hide its components, or
maximized to fill its container.

The user can position a Node (along with its components) in a space manually via either drag and drop or selection and click command. The position of a component relative to its container is stored in the Present relationship between them. When a Node is moved to a new container, the corresponding Present relationships are automatically deleted and created. Define relationships are created via selection and click command.
When the user selects a Node, its details are displayed in the dashboard that accompanies his world Node in the view. These include information and controls on the adjacent Nodes and the relationships connecting them. Adjacent relationships/Nodes can be grouped into sets, either by relationship type and direction or by manual selection, so that the user can operate on them simultaneously.
Dashboard controls enable the user to create and delete relationships. They also let him move adjacent Nodes (into the selected Node's parent container, into the selected Node itself, or out of the selected Node). Some operations may be applied recursively (with support for depth limits). For instance, the user can select a Node and recursively apply the [make specifics (neighbors via Define_in) into components (neighbors via Present_out)] operation, followed by the [display components in a list] operation. This would re-outline the related content according to the selected abstraction!
When a Node is committed, the service automatically creates Defines from it to the 4 coordinate Nodes that correspond with the user's position in space-time. These coordinating Nodes are what initially connect the user's structure to that of other users, allowing him to create further connections with their structures, and they with his. The user can Define abstractions on these coordinates, like cities and seasons.
The user can make a Node private, obscuring its contents to everyone but the user. If the user creates a relationship between his private Node and another user's Node, the content of this Node becomes visible to her.
When the user brings another user's Node into his view, he can set his Present to synchronize itself with her Present, so that any repositioning she does is duplicated in his view. He may want to Define one of his abstractions with this Node, to maintain a consistent handle on it, in case she breaks the synchronization by Presenting the Node from another container not in his view. Or, a stronger synchronization setting can automatically bring these extra containers into view.
When the user modifies his Nodes, Defines, or Presents, the changes are streamed live to everyone with those objects in view. Uncommitted Nodes can be used for live, ephemeral chat. The user can move a Node around (in and out of) a container as an avatar or a prop. He can form a party with his friends, roaming from container to container, play a card game, present a set of slides, etc.
The user can follow the paths laid out by righteous users, and duplicate those paths with his own. Aggregating the relationships between Nodes yields a gradient of the community's preference.
The user can mark a pair of Nodes as equivalent by creating two Defines that link the pair in each direction. When he and another user each create such a Define cycle between one of his Nodes and one of hers, they have declared an isomorphism between their structures.
The user can tip (i.e. pay) and/or subscribe to another user at one of her Nodes using an internal currency called Joles. Joles are earned from the system by performing services for the community, such as paying the developers money. Joles can be used to purchase various doodads and knickknacks from the store, such as fonts, animations, advertising bandwidth, weapons (e.g. an ability that minimizes the targeted Node after 10 seconds), shields (e.g. so the attackers need 100 times the attacker*seconds to minimize your Node), better weapons..., hats, etc. The store and its products will be modeled in the graph, using the components described.
Machine learning will be applied to create agents that play the role of teacher/enzyme, linking together related (e.g. anti-related) Nodes, to promote interaction between users based on the content they publish. An API will allow researchers and developers to query the graph directly and perform their own studies and provide their own services/agents. Keyword search will be implemented in this enzymatic model, where the user creates a Node with a query in it, perhaps addressing the enzyme by name in the query or Defining the enzyme with it, and the enzyme would link that Node with some response.
The user can select a section of the graph and scroll backwards and forwards over time to animate its transformation.
Integration with git, syntax highlighting, a javascript engine, and other development tools that make the app a good software development environment. The app will be designed to facilitate extension with tools and features.
Integration with web browsers will allow users to interact with external web pages and manage their bookmarks.
Native apps for computer and mobile will be added to the web app, which might be called Graph Outliner. Maybe the mobile app will be called Pocket Book, because you write in it on the go. I'd like to brand a user's structure as a Mandala or a Notation or a personal symbol in a human alphabet that might be mostly symmetrical with other symbols and form nice little groups in a taxonomic tree.
VR integration will allow for 3D visualizations of the Internet. I think the VR app will be called Matrix.
The code and models will be made as freely available as possible. They will be engineered to emphasize readability and elegance.
