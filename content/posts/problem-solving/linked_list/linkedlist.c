#include <stdio.h>
#include <stdlib.h>

typedef struct ListNode {
    int val;
    struct ListNode *next;
} ListNode;

typedef struct LinkedList {
    ListNode *head;
    ListNode *tail;
} LinkedList;

ListNode *createNewNode(int val) {
    ListNode *newNode = (ListNode *)malloc(sizeof(ListNode));
    newNode->val = val;
    newNode->next = NULL;
    return newNode;
}

// Initialize the linked list with a dummy node.
void initLinkedList(LinkedList *list) {
    // Create a new node for the dummy head.
    ListNode *newNode = createNewNode(-1);

    // Set both head and tail pointers to the new dummy node.
    list->head = newNode;
    list->tail = newNode;
}

// Insert a new node at the end of the linked list.
void insertEnd(LinkedList *list, int val) {
    // Create a new node with the given value.
    ListNode *newNode = createNewNode(val);
    // Connect two node; in this case last node and the newNode via tail pointer
    list->tail->next = newNode; // list->tail is the last node
    // Move tail to the new last node
    list->tail = newNode;
}

ListNode *findPrevious(LinkedList *list, int index) {
    int i = 0;
    ListNode *curr = list->head;
    while (i < index && curr->next) {
        curr = curr->next;
        i++;
    }
    return curr;
}

// Insert a new node at the specified index.
void insertAt(LinkedList *list, int index, int val) {
    ListNode *newNode = createNewNode(val);
    ListNode *prev = findPrevious(list, index - 1);
    if (prev) {
        newNode->next = prev->next;
        prev->next = newNode;
        if (prev == list->tail) {
            list->tail = newNode;
        }
    }
}

// Remove a node at the given index.
void removeNode(LinkedList *list, int index) {
    ListNode *prev = findPrevious(list, index - 1);
    if (prev && prev->next) {
        ListNode *temp = prev->next;
        prev->next = temp->next;
        free(temp);
        if (prev->next == NULL) {
            list->tail = prev;
        }
    }
}

// Print the linked list.
void printLinkedList(LinkedList *list) {
    ListNode *curr = list->head->next;
    if (!curr) {
        printf("Empty\n");
        return;
    }

    while (curr) {
        printf("%d", curr->val);
        if (curr->next != NULL) {
            printf(" -> ");
        }
        curr = curr->next;
    }
    printf("\n");
}

// Destroy the linked list and free memory.
void destroyLinkedList(LinkedList *list) {
    ListNode *curr = list->head;
    while (curr) {
        ListNode *temp = curr;
        curr = curr->next;
        free(temp);
    }
}

int main() {
    LinkedList list;
    initLinkedList(&list);
    printLinkedList(&list);

    insertEnd(&list, 10);
    insertEnd(&list, 20);
    insertEnd(&list, 30);
    insertEnd(&list, 40);

    printLinkedList(&list);

    insertAt(&list, 2, 25);
    printLinkedList(&list);

    removeNode(&list, 2);
    printLinkedList(&list);

    destroyLinkedList(&list);

    return 0;
}
