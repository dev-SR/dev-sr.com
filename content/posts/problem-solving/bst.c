#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

typedef struct BinarySearchTree {
    TreeNode *root;
} BinarySearchTree;

BinarySearchTree *createBST() {
    BinarySearchTree *bst = (BinarySearchTree *)malloc(sizeof(BinarySearchTree));
    bst->root = NULL;
    return bst;
}

int search(TreeNode *root, int target) {
    if (!root) {
        return 0;
    }

    if (target > root->val) {
        return search(root->right, target);
    } else if (target < root->val) {
        return search(root->left, target);
    } else {
        return 1;
    }
}

TreeNode *insert(TreeNode *root, int val) {
    if (!root) {
        TreeNode *newNode = (TreeNode *)malloc(sizeof(TreeNode));
        newNode->val = val;
        newNode->left = NULL;
        newNode->right = NULL;
        return newNode;
    }

    if (val > root->val) {
        root->right = insert(root->right, val);
    } else if (val < root->val) {
        root->left = insert(root->left, val);
    }
    return root;
}

TreeNode *minValueNode(TreeNode *root) {
    TreeNode *curr = root;
    while (curr && curr->left) {
        curr = curr->left;
    }
    return curr;
}

TreeNode *removeNode(TreeNode *root, int val) {
    if (!root) {
        return NULL;
    }

    if (val > root->val) {
        root->right = removeNode(root->right, val);
    } else if (val < root->val) {
        root->left = removeNode(root->left, val);
    } else {
        if (!root->left) {
            TreeNode *temp = root->right;
            free(root);
            return temp;
        } else if (!root->right) {
            TreeNode *temp = root->left;
            free(root);
            return temp;
        } else {
            TreeNode *minNode = minValueNode(root->right);
            root->val = minNode->val;
            root->right = removeNode(root->right, minNode->val);
        }
    }
    return root;
}

void inorder(TreeNode *root) {
    if (!root) {
        return;
    }

    inorder(root->left);
    printf("%d ", root->val);
    inorder(root->right);
}

void printTree(TreeNode *root, int level) {
    if (root) {
        printTree(root->right, level + 1);
        for (int i = 0; i < level; i++) {
            printf("    ");
        }
        printf("%d\n", root->val);
        printTree(root->left, level + 1);
    }
}
void freeTree(TreeNode *root) {
    if (root) {
        freeTree(root->left);
        freeTree(root->right);
        free(root);
    }
}

int main() {
    BinarySearchTree *bst = createBST();

    bst->root = insert(bst->root, 50);
    bst->root = insert(bst->root, 30);
    bst->root = insert(bst->root, 70);
    bst->root = insert(bst->root, 20);
    bst->root = insert(bst->root, 40);
    bst->root = insert(bst->root, 60);
    bst->root = insert(bst->root, 80);

    inorder(bst->root);
    printf("\n");

    printTree(bst->root, 0);

    bst->root = removeNode(bst->root, 50);
    inorder(bst->root);
    printf("\n");
    printTree(bst->root, 0);

    // Free allocated memory
    freeTree(bst->root);
    free(bst);

    return 0;
}
