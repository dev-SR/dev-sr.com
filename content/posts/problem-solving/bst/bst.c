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

TreeNode *create_new_node(int value) {
    TreeNode *newNode = (TreeNode *)malloc(sizeof(TreeNode));
    newNode->val = value;
    newNode->left = newNode->right = NULL;
    return newNode;
}
TreeNode *search_recursive(TreeNode *root, int target) {
    if (!root) {
        return NULL;
    }
    if (target > root->val) {
        return search_recursive(root->right, target);
    } else if (target < root->val) {
        return search_recursive(root->left, target);
    } else {
        return root;
    }
}

TreeNode *insert_recursive(TreeNode *root, int val) {
    if (!root) {
        return create_new_node(val);
    }
    if (val > root->val) {
        root->right = insert_recursive(root->right, val);
    } else if (val < root->val) {
        root->left = insert_recursive(root->left, val);
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

TreeNode *remove_recursive(TreeNode *root, int val) {
    if (!root) {
        return NULL;
    }

    if (val > root->val) {
        root->right = remove_recursive(root->right, val);
    } else if (val < root->val) {
        root->left = remove_recursive(root->left, val);
    } else {
        if (!root->left) {
            TreeNode *temp = root->right;
            free(root);
            return temp;
        } else if (!root->right) {
            TreeNode *temp = root->left;
            free(root);
            return temp;
        }

        TreeNode *minNode = minValueNode(root->right);
        root->val = minNode->val;
        root->right = remove_recursive(root->right, minNode->val);
    }
    return root;
}

void inorder_traversal_recursive(TreeNode *root) {
    if (!root) {
        return;
    }
    inorder_traversal_recursive(root->left);
    printf("%d ", root->val);
    inorder_traversal_recursive(root->right);
}

void print_tree_recursive(TreeNode *root, int level) {
    if (root) {
        print_tree_recursive(root->right, level + 1);
        for (int i = 0; i < level; i++) {
            printf("    ");
        }
        printf("%d\n", root->val);
        print_tree_recursive(root->left, level + 1);
    }
}

int main() {
    BinarySearchTree bst;
    bst.root = NULL;

    bst.root = insert_recursive(bst.root, 50);
    bst.root = insert_recursive(bst.root, 30);
    bst.root = insert_recursive(bst.root, 70);
    bst.root = insert_recursive(bst.root, 20);
    bst.root = insert_recursive(bst.root, 40);
    bst.root = insert_recursive(bst.root, 60);
    bst.root = insert_recursive(bst.root, 80);

    inorder_traversal_recursive(bst.root);
    printf("\n");
    print_tree_recursive(bst.root, 0);

    bst.root = remove_recursive(bst.root, 50);
    inorder_traversal_recursive(bst.root);
    printf("\n");
    print_tree_recursive(bst.root, 0);

    // search for 50
    TreeNode *result = search_recursive(bst.root, 50);
    if (result) {
        printf("Found %d\n", result->val);
    } else {
        printf("Not found\n");
    }

    return 0;
}
