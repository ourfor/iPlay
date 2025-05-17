package top.ourfor.app.iplay.bean;

public interface PageLifecycle {
    default void onAttach() {};
    default void onDetach() {};
}
