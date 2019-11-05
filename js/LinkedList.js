class Node{
    constructor(data, next = null){
        this.data = data,
        this.next = next
    }
}

class LinkedList{
    constructor(){
        this.head = null;
    }

    insert(data){
        //new node at the end
        let newNode = new Node(data);

        // When head = null i.e. the list is empty, then head itself will point to the newNode.
        if(!this.head){
            this.head = newNode;
            return this.head;
        }

        // Else, traverse the list to find the tail (the tail node will initially be pointing at null), and update the tail's next pointer.   let tail = this.head;
        while(tail.next !== null){
            tail = tail.next;
        }
        tail.next = newNode;   
        return this.head;
    }
}